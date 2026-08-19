import assert from "node:assert/strict";
import {
  runSampleRequestWorkflow,
  validateSampleRequest,
} from "../src/lib/sampleRequestWorkflow.js";

const validRequest = {
  businessName: "Codex Test Café",
  businessType: "independent-cafe",
  location: "London",
  currentSupplier: "Current Coffee Co",
  coffeeVolume: "10-25kg",
  interestedProducts: ["Camogli"],
  name: "Test Applicant",
  email: "applicant@example.com",
  phone: "+44 20 7000 0000",
  position: "Owner",
  deliveryAddress: "1 Test Street, London, SW1A 1AA",
  preferredDeliveryTime: "morning",
  comments: "Please call before delivery.",
};

assert.equal(validateSampleRequest(validRequest), "");
assert.match(validateSampleRequest({}), /Please complete/);
assert.match(validateSampleRequest({ ...validRequest, email: "not-an-email" }), /valid email/);

const storedRecords = [];
const updates = [];
const messages = [];

const success = await runSampleRequestWorkflow(validRequest, {
  now: () => new Date("2026-08-19T12:00:00.000Z"),
  createReference: () => "ABC12345",
  createRecord: async (record) => {
    storedRecords.push(record);
    return { ...record, id: "request-1" };
  },
  updateRecord: async (id, update) => updates.push({ id, update }),
  sendEmail: async (message) => messages.push(message),
});

assert.equal(success.reference, "TR-20260819-ABC12345");
assert.equal(success.allNotificationsSent, true);
assert.equal(storedRecords.length, 1);
assert.equal(storedRecords[0].email, "applicant@example.com");
assert.equal(messages.length, 2);
assert.equal(messages[0].to, "info@theroastingltd.co.uk");
assert.equal(messages[1].to, "applicant@example.com");
assert.equal(updates[0].update.status, "notified");

let applicantAttempts = 0;
const partial = await runSampleRequestWorkflow(validRequest, {
  now: () => new Date("2026-08-19T12:00:00.000Z"),
  createReference: () => "FAILED01",
  createRecord: async (record) => ({ ...record, id: "request-2" }),
  updateRecord: async (_id, update) => {
    assert.equal(update.status, "needs_attention");
  },
  sendEmail: async (message) => {
    if (message.to === validRequest.email) {
      applicantAttempts += 1;
      throw new Error("Simulated email failure");
    }
  },
});

assert.equal(applicantAttempts, 2);
assert.equal(partial.notifications.administrator, "sent");
assert.equal(partial.notifications.applicant, "failed");
assert.equal(partial.allNotificationsSent, false);

console.log("Sample request workflow tests passed");
