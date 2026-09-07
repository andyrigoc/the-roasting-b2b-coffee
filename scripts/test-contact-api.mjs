import assert from "node:assert/strict";
import handler from "../api/contact.js";

process.env.RESEND_API_KEY = "test-key";
process.env.RESEND_FROM_EMAIL = "The Roasting <info@theroasting.co.uk>";
process.env.ADMIN_EMAIL = "info@theroasting.co.uk";

const sentEmails = [];
globalThis.fetch = async (_url, options) => {
  sentEmails.push(JSON.parse(options.body));
  return {
    ok: true,
    json: async () => ({ id: `email-${sentEmails.length}` }),
  };
};

const request = {
  method: "POST",
  body: {
    businessName: "Test Café",
    businessType: "independent-cafe",
    location: "London",
    coffeeVolume: "10-25kg",
    interestedProducts: ["Single Origin"],
    name: "Alex Example",
    email: "alex@example.com",
    deliveryAddress: "1 Test Street",
  },
};

const response = {
  statusCode: 200,
  payload: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.payload = payload; return this; },
};

await handler(request, response);

assert.equal(response.statusCode, 200);
assert.match(response.payload.reference, /^TR-\d{8}-[A-F0-9]{8}$/);
assert.equal(response.payload.allNotificationsSent, true);
assert.equal(sentEmails.length, 2);
assert.deepEqual(sentEmails[0].to, ["info@theroasting.co.uk"]);
assert.deepEqual(sentEmails[1].to, ["alex@example.com"]);
assert.equal(sentEmails[0].reply_to, "alex@example.com");
assert.match(sentEmails[1].html, /https:\/\/www\.theroasting\.co\.uk\/Logo\.png/);

console.log("Standalone Resend contact endpoint tests passed");
