import { SampleRequest } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
import { runSampleRequestWorkflow } from "@/lib/sampleRequestWorkflow";

function createReference() {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

export function submitSampleRequest(payload) {
  return runSampleRequestWorkflow(payload, {
    createReference,
    createRecord: (record) => SampleRequest.create(record),
    updateRecord: (id, updates) => SampleRequest.update(id, updates),
    sendEmail: (message) => SendEmail(message),
  });
}
