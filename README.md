# The Roasting B2B Coffee

## Sample request workflow

The sample request form uses the existing Base44 backend to:

1. Validate and store every request as a `SampleRequest` record.
2. Notify `info@theroastingltd.co.uk` with the complete request details.
3. Send a confirmation email to the applicant.
4. Record both email delivery attempts against the request.

No browser-exposed email credentials are required. The `SampleRequest` entity in
`base44/entities/SampleRequest.jsonc` must be included when the Base44 app is deployed.

Run `npm run test:sample-request` to verify the storage and notification workflow.
