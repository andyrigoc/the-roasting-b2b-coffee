# The Roasting B2B Coffee

## Local development

When you open this project folder in VS Code, it starts the Vite development
server automatically at <http://127.0.0.1:5173/>. If VS Code asks whether to
allow automatic tasks, allow them for this workspace. Keep VS Code open while
using the local preview.

To start it manually instead, run `npm run dev` in the project folder. The
development server uses port `5173`; it reports an error instead of silently
switching ports if that port is already in use.

## Sample request workflow

The sample request form uses the existing Base44 backend to:

1. Validate and store every request as a `SampleRequest` record.
2. Notify `info@theroastingltd.co.uk` with the complete request details.
3. Send a confirmation email to the applicant.
4. Record both email delivery attempts against the request.

No browser-exposed email credentials are required. The `SampleRequest` entity in
`base44/entities/SampleRequest.jsonc` must be included when the Base44 app is deployed.

Run `npm run test:sample-request` to verify the storage and notification workflow.
