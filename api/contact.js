import { Resend } from "resend";

const DEFAULT_RECIPIENT = "info@theroastingltd.co.uk";
const DEFAULT_FROM = "The Roasting <samples@theroastingltd.co.uk>";

const businessTypeLabels = {
  "independent-cafe": "Independent Café",
  restaurant: "Restaurant",
  hotel: "Hotel",
  office: "Office",
  retail: "Retail Location",
  other: "Other"
};

const volumeLabels = {
  "under-10kg": "Under 10kg",
  "10-25kg": "10-25kg",
  "25-50kg": "25-50kg",
  "50-100kg": "50-100kg",
  "over-100kg": "Over 100kg"
};

const deliveryLabels = {
  morning: "Morning (9am-12pm)",
  afternoon: "Afternoon (12pm-5pm)",
  anytime: "Anytime"
};

const requiredFields = [
  ["businessName", "Business name"],
  ["businessType", "Business type"],
  ["location", "Location"],
  ["coffeeVolume", "Monthly coffee volume"],
  ["name", "Full name"],
  ["email", "Email address"],
  ["deliveryAddress", "Delivery address"]
];

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
}

async function parseRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  let rawBody = "";

  for await (const chunk of req) {
    rawBody += chunk;
  }

  return rawBody ? JSON.parse(rawBody) : {};
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asText(value, fallback = "Not provided") {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  return value ? String(value).trim() : fallback;
}

function formatLabel(value, labels, fallback = "Not provided") {
  return labels[value] || asText(value, fallback);
}

function splitRecipients(value) {
  return String(value || DEFAULT_RECIPIENT)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function validatePayload(payload) {
  const missing = requiredFields
    .filter(([field]) => !asText(payload[field], "").trim())
    .map(([, label]) => label);

  if (missing.length) {
    return `Please complete: ${missing.join(", ")}.`;
  }

  const email = asText(payload.email, "");
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailLooksValid) {
    return "Please enter a valid email address.";
  }

  return "";
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="padding: 12px 0; color: #6f655f; font-size: 13px; vertical-align: top; width: 38%;">${escapeHtml(label)}</td>
      <td style="padding: 12px 0; color: #201e20; font-size: 15px; font-weight: 600; vertical-align: top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function buildInternalHtml(payload) {
  const products = Array.isArray(payload.interestedProducts)
    ? payload.interestedProducts
    : [];

  return `
<!doctype html>
<html>
  <body style="margin: 0; padding: 0; background: #f5f1ec; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f5f1ec; padding: 28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e8ddd2;">
            <tr>
              <td style="background: #622700; padding: 28px 32px;">
                <p style="margin: 0 0 8px; color: #f2d7bd; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">New sample request</p>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.25;">${escapeHtml(payload.businessName)}</h1>
                <p style="margin: 10px 0 0; color: #fff6ee; font-size: 15px;">${escapeHtml(payload.name)} is interested in The Roasting coffee samples.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px;">
                <h2 style="margin: 0 0 14px; color: #201e20; font-size: 18px;">Lead details</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  ${detailRow("Contact", `${asText(payload.name)} - ${asText(payload.position)}`)}
                  ${detailRow("Email", asText(payload.email))}
                  ${detailRow("Phone", asText(payload.phone))}
                  ${detailRow("Business type", formatLabel(payload.businessType, businessTypeLabels))}
                  ${detailRow("Location", asText(payload.location))}
                  ${detailRow("Current supplier", asText(payload.currentSupplier))}
                  ${detailRow("Monthly volume", formatLabel(payload.coffeeVolume, volumeLabels))}
                  ${detailRow("Products of interest", asText(products))}
                  ${detailRow("Delivery address", asText(payload.deliveryAddress))}
                  ${detailRow("Preferred delivery", formatLabel(payload.preferredDeliveryTime, deliveryLabels))}
                </table>

                <div style="margin-top: 24px; padding: 18px; background: #faf7f3; border: 1px solid #eadfd5; border-radius: 10px;">
                  <p style="margin: 0 0 8px; color: #6f655f; font-size: 13px;">Additional comments</p>
                  <p style="margin: 0; color: #201e20; font-size: 15px; line-height: 1.6;">${escapeHtml(asText(payload.comments, "None"))}</p>
                </div>

                <p style="margin: 24px 0 0; color: #6f655f; font-size: 13px; line-height: 1.6;">
                  Tip: reply directly to this email to respond to ${escapeHtml(payload.name)} at ${escapeHtml(payload.email)}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function buildConfirmationHtml(payload) {
  return `
<!doctype html>
<html>
  <body style="margin: 0; padding: 0; background: #f5f1ec; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f5f1ec; padding: 28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e8ddd2;">
            <tr>
              <td style="background: #622700; padding: 30px 32px;">
                <p style="margin: 0 0 8px; color: #f2d7bd; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">The Roasting</p>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.25;">We received your sample request</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 32px; color: #201e20;">
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">Hi ${escapeHtml(payload.name)},</p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">
                  Thanks for reaching out. We have your details for ${escapeHtml(payload.businessName)} and will be in touch within 24 hours to arrange your coffee samples.
                </p>
                <div style="margin: 24px 0; padding: 18px; background: #faf7f3; border: 1px solid #eadfd5; border-radius: 10px;">
                  <p style="margin: 0 0 8px; color: #6f655f; font-size: 13px;">Requested samples</p>
                  <p style="margin: 0; color: #201e20; font-size: 15px; font-weight: 600; line-height: 1.6;">${escapeHtml(asText(payload.interestedProducts, "A tailored coffee selection"))}</p>
                </div>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">
                  If anything changes before we contact you, simply reply to this email.
                </p>
                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.7;">The Roasting team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function buildInternalText(payload) {
  return `
New sample request from ${asText(payload.name)} (${asText(payload.email)})

Business: ${asText(payload.businessName)}
Business type: ${formatLabel(payload.businessType, businessTypeLabels)}
Location: ${asText(payload.location)}
Current supplier: ${asText(payload.currentSupplier)}
Monthly volume: ${formatLabel(payload.coffeeVolume, volumeLabels)}
Products of interest: ${asText(payload.interestedProducts)}

Position: ${asText(payload.position)}
Phone: ${asText(payload.phone)}
Delivery address: ${asText(payload.deliveryAddress)}
Preferred delivery: ${formatLabel(payload.preferredDeliveryTime, deliveryLabels)}
Comments: ${asText(payload.comments, "None")}
  `.trim();
}

function buildConfirmationText(payload) {
  return `
Hi ${asText(payload.name)},

Thanks for reaching out. We have your details for ${asText(payload.businessName)} and will be in touch within 24 hours to arrange your coffee samples.

Requested samples: ${asText(payload.interestedProducts, "A tailored coffee selection")}

If anything changes before we contact you, simply reply to this email.

The Roasting team
  `.trim();
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const resend = getResendClient();

  if (!resend) {
    return res.status(500).json({
      error: "Email service is not configured. Add RESEND_API_KEY to your environment."
    });
  }

  try {
    const payload = await parseRequestBody(req);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const to = splitRecipients(process.env.CONTACT_EMAIL_TO);
    const from = process.env.CONTACT_EMAIL_FROM || DEFAULT_FROM;
    const replyTo = process.env.CONTACT_REPLY_TO || payload.email;
    const subject = `New sample request: ${asText(payload.businessName)}`;

    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject,
      html: buildInternalHtml(payload),
      text: buildInternalText(payload)
    });

    if (error) {
      console.error("Resend internal email failed", error);
      return res.status(502).json({
        error: "We could not send your request right now. Please try again in a moment."
      });
    }

    let confirmationId = null;

    if (process.env.CONTACT_SEND_CONFIRMATION !== "false") {
      try {
        const confirmation = await resend.emails.send({
          from: process.env.CONTACT_CONFIRMATION_FROM || from,
          to: payload.email,
          replyTo: process.env.CONTACT_REPLY_TO || to[0],
          subject: "We received your sample request",
          html: buildConfirmationHtml(payload),
          text: buildConfirmationText(payload)
        });

        if (confirmation.error) {
          console.error("Resend confirmation email failed", confirmation.error);
        } else {
          confirmationId = confirmation.data?.id || null;
        }
      } catch (confirmationError) {
        console.error("Resend confirmation email threw", confirmationError);
      }
    }

    return res.status(200).json({
      ok: true,
      id: data?.id || null,
      confirmationId
    });
  } catch (error) {
    console.error("Contact form email failed", error);
    return res.status(500).json({
      error: "We could not send your request right now. Please try again in a moment."
    });
  }
}
