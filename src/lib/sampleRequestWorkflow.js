const ADMIN_EMAIL = "info@theroasting.co.uk";

const businessTypeLabels = {
  "independent-cafe": "Independent Café",
  restaurant: "Restaurant",
  hotel: "Hotel",
  office: "Office",
  retail: "Retail Location",
  other: "Other",
};

const volumeLabels = {
  "under-10kg": "Under 10kg",
  "10-25kg": "10–25kg",
  "25-50kg": "25–50kg",
  "50-100kg": "50–100kg",
  "over-100kg": "Over 100kg",
};

const deliveryLabels = {
  morning: "Morning (9am–12pm)",
  afternoon: "Afternoon (12pm–5pm)",
  anytime: "Any time",
};

const requiredFields = [
  ["businessName", "Business name"],
  ["businessType", "Business type"],
  ["location", "Location"],
  ["coffeeVolume", "Monthly coffee volume"],
  ["name", "Full name"],
  ["email", "Email address"],
  ["deliveryAddress", "Delivery address"],
];

function text(value, fallback = "Not provided") {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  const cleanValue = String(value ?? "").trim();
  return cleanValue || fallback;
}

function labelled(value, labels) {
  return labels[value] || text(value);
}

export function normaliseSampleRequest(payload) {
  return {
    businessName: text(payload.businessName, ""),
    businessType: text(payload.businessType, ""),
    location: text(payload.location, ""),
    currentSupplier: text(payload.currentSupplier, ""),
    coffeeVolume: text(payload.coffeeVolume, ""),
    interestedProducts: Array.isArray(payload.interestedProducts)
      ? payload.interestedProducts.map((product) => text(product, "")).filter(Boolean)
      : [],
    name: text(payload.name, ""),
    email: text(payload.email, "").toLowerCase(),
    phone: text(payload.phone, ""),
    position: text(payload.position, ""),
    deliveryAddress: text(payload.deliveryAddress, ""),
    preferredDeliveryTime: text(payload.preferredDeliveryTime, ""),
    comments: text(payload.comments, ""),
  };
}

export function validateSampleRequest(payload) {
  const request = normaliseSampleRequest(payload);
  const missing = requiredFields
    .filter(([field]) => !request[field])
    .map(([, label]) => label);

  if (missing.length) {
    return `Please complete: ${missing.join(", ")}.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function buildAdministratorEmail(request, reference) {
  return {
    to: ADMIN_EMAIL,
    from_name: "The Roasting website",
    subject: `New sample request: ${request.businessName}`,
    body: [
      `New sample request (${reference})`,
      "",
      `Business: ${request.businessName}`,
      `Business type: ${labelled(request.businessType, businessTypeLabels)}`,
      `Location: ${request.location}`,
      `Current supplier: ${text(request.currentSupplier)}`,
      `Monthly coffee volume: ${labelled(request.coffeeVolume, volumeLabels)}`,
      `Coffee of interest: ${text(request.interestedProducts, "A tailored coffee selection")}`,
      "",
      `Contact: ${request.name}`,
      `Position: ${text(request.position)}`,
      `Email: ${request.email}`,
      `Phone: ${text(request.phone)}`,
      "",
      `Delivery address: ${request.deliveryAddress}`,
      `Preferred delivery time: ${labelled(request.preferredDeliveryTime, deliveryLabels)}`,
      `Comments: ${text(request.comments, "None")}`,
    ].join("\n"),
  };
}

export function buildApplicantEmail(request, reference) {
  return {
    to: request.email,
    from_name: "The Roasting",
    subject: "We received your sample request",
    body: [
      `Hi ${request.name},`,
      "",
      `Thank you for requesting coffee samples for ${request.businessName}. Your request reference is ${reference}.`,
      "",
      "We have saved your details and will be in touch within 24 hours to arrange your sample delivery.",
      `Coffee requested: ${text(request.interestedProducts, "A tailored coffee selection")}`,
      "",
      "If anything changes, reply to info@theroasting.co.uk.",
      "",
      "The Roasting team",
    ].join("\n"),
  };
}

async function sendWithRetry(sendEmail, message) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await sendEmail(message);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function runSampleRequestWorkflow(payload, dependencies) {
  const validationError = validateSampleRequest(payload);

  if (validationError) {
    throw new Error(validationError);
  }

  const request = normaliseSampleRequest(payload);
  const submittedAt = (dependencies.now?.() || new Date()).toISOString();
  const reference = `TR-${submittedAt.slice(0, 10).replaceAll("-", "")}-${dependencies.createReference()}`;
  const record = await dependencies.createRecord({
    ...request,
    reference,
    submittedAt,
    status: "received",
    administratorEmailStatus: "pending",
    applicantEmailStatus: "pending",
  });

  const [administratorResult, applicantResult] = await Promise.allSettled([
    sendWithRetry(dependencies.sendEmail, buildAdministratorEmail(request, reference)),
    sendWithRetry(dependencies.sendEmail, buildApplicantEmail(request, reference)),
  ]);

  const notifications = {
    administrator: administratorResult.status === "fulfilled" ? "sent" : "failed",
    applicant: applicantResult.status === "fulfilled" ? "sent" : "failed",
  };

  if (record?.id) {
    await dependencies.updateRecord(record.id, {
      administratorEmailStatus: notifications.administrator,
      applicantEmailStatus: notifications.applicant,
      status: notifications.administrator === "sent" && notifications.applicant === "sent"
        ? "notified"
        : "needs_attention",
    });
  }

  return {
    reference,
    recordId: record?.id || null,
    notifications,
    allNotificationsSent:
      notifications.administrator === "sent" && notifications.applicant === "sent",
  };
}
