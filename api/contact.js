import { randomUUID } from "node:crypto";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_ADMIN_EMAIL = "info@theroastingltd.co.uk";
const DEFAULT_FROM_EMAIL = "The Roasting <samples@theroastingltd.co.uk>";

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
  if (Array.isArray(value)) return value.length ? value.join(", ") : fallback;
  const cleanValue = String(value ?? "").trim();
  return cleanValue || fallback;
}

function escapeHtml(value) {
  return text(value, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalisePayload(payload) {
  return {
    businessName: text(payload.businessName, ""),
    businessType: text(payload.businessType, ""),
    location: text(payload.location, ""),
    currentSupplier: text(payload.currentSupplier, ""),
    coffeeVolume: text(payload.coffeeVolume, ""),
    interestedProducts: Array.isArray(payload.interestedProducts)
      ? payload.interestedProducts.map((item) => text(item, "")).filter(Boolean)
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

function validatePayload(payload) {
  const missing = requiredFields
    .filter(([field]) => !payload[field])
    .map(([, label]) => label);

  if (missing.length) return `Please complete: ${missing.join(", ")}.`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Please enter a valid email address.";
  }
  return "";
}

function detailRow(label, value) {
  return `<tr><td style="padding:8px 12px 8px 0;color:#74685f;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;color:#201e20;font-weight:600">${escapeHtml(value)}</td></tr>`;
}

function emailShell(title, eyebrow, content) {
  return `<!doctype html><html><body style="margin:0;background:#f5f1ec;font-family:Arial,sans-serif;color:#201e20"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fff;border:1px solid #e8ddd2;border-radius:14px;overflow:hidden"><tr><td style="background:#622700;padding:28px 32px"><p style="margin:0 0 8px;color:#f2d7bd;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${escapeHtml(eyebrow)}</p><h1 style="margin:0;color:#fff;font-size:28px;line-height:1.25">${escapeHtml(title)}</h1></td></tr><tr><td style="padding:28px 32px">${content}</td></tr></table></td></tr></table></body></html>`;
}

function buildAdministratorEmail(request, reference, from, adminEmail) {
  const rows = [
    ["Reference", reference],
    ["Business", request.businessName],
    ["Business type", request.businessType],
    ["Location", request.location],
    ["Current supplier", text(request.currentSupplier)],
    ["Monthly volume", request.coffeeVolume],
    ["Products of interest", text(request.interestedProducts, "A tailored selection")],
    ["Contact", request.name],
    ["Position", text(request.position)],
    ["Email", request.email],
    ["Phone", text(request.phone)],
    ["Delivery address", request.deliveryAddress],
    ["Preferred delivery", text(request.preferredDeliveryTime)],
    ["Comments", text(request.comments, "None")],
  ];

  return {
    from,
    to: [adminEmail],
    reply_to: request.email,
    subject: `New sample request: ${request.businessName}`,
    html: emailShell(
      request.businessName,
      "New sample request",
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows.map(([label, value]) => detailRow(label, value)).join("")}</table>`,
    ),
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
  };
}

function buildApplicantEmail(request, reference, from, adminEmail) {
  const content = `<p style="font-size:16px;line-height:1.7">Hi ${escapeHtml(request.name)},</p><p style="font-size:16px;line-height:1.7">Thank you for requesting coffee samples for ${escapeHtml(request.businessName)}. Our team has received your details and will contact you within 24 hours.</p><div style="margin:24px 0;padding:18px;background:#faf7f3;border:1px solid #eadfd5;border-radius:10px"><p style="margin:0 0 8px;color:#74685f;font-size:13px">Request reference</p><p style="margin:0;font-weight:700">${escapeHtml(reference)}</p></div><p style="font-size:16px;line-height:1.7">If anything changes, simply reply to this email.</p><p style="font-size:16px;line-height:1.7">The Roasting team</p>`;

  return {
    from,
    to: [request.email],
    reply_to: adminEmail,
    subject: "We received your sample request",
    html: emailShell("We received your sample request", "The Roasting", content),
    text: `Hi ${request.name},\n\nThank you for requesting coffee samples for ${request.businessName}. Our team has received your details and will contact you within 24 hours.\n\nRequest reference: ${reference}\n\nIf anything changes, reply to ${adminEmail}.\n\nThe Roasting team`,
  };
}

async function sendEmail(apiKey, message) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Resend rejected the email.");
  return result;
}

async function requestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  let rawBody = "";
  for await (const chunk of req) rawBody += chunk;
  return rawBody ? JSON.parse(rawBody) : {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  if (!apiKey) return res.status(500).json({ error: "Email service is not configured." });

  try {
    const request = normalisePayload(await requestBody(req));
    const validationError = validatePayload(request);
    if (validationError) return res.status(400).json({ error: validationError });

    const submittedAt = new Date();
    const reference = `TR-${submittedAt.toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const administrator = await sendEmail(
      apiKey,
      buildAdministratorEmail(request, reference, from, adminEmail),
    );

    let applicant = null;
    try {
      applicant = await sendEmail(
        apiKey,
        buildApplicantEmail(request, reference, from, adminEmail),
      );
    } catch (error) {
      console.error("Applicant confirmation email failed", error);
    }

    return res.status(200).json({
      reference,
      recordId: null,
      notifications: {
        administrator: "sent",
        applicant: applicant ? "sent" : "failed",
      },
      allNotificationsSent: Boolean(applicant),
      emailIds: {
        administrator: administrator.id || null,
        applicant: applicant?.id || null,
      },
    });
  } catch (error) {
    console.error("Sample request failed", error);
    return res.status(502).json({
      error: "We could not send your request right now. Please try again in a moment.",
    });
  }
}
