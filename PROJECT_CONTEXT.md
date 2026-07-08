# Roasting Web Project Context

Date: 2026-06-19

## Project Location

- Workspace root: `C:\Users\Hp\Downloads\Roasting Web\Roasting Web`
- App folder: `the-roasting-b2b-coffee-final`
- Exports present:
  - `the-roasting-b2b-coffee-final.zip`
  - `Coffee_export.csv`
  - `PhotoGallery_export.csv`

## Current Local Status

- The React/Vite app runs locally at `http://localhost:5173`.
- The project needs Base44 legacy imports enabled when building/running:

```powershell
$env:BASE44_LEGACY_SDK_IMPORTS='true'
npm run dev -- --host 127.0.0.1
```

Build verification passed with:

```powershell
$env:BASE44_LEGACY_SDK_IMPORTS='true'; npm run build
```

## Important Changes Made

- Added local product fallback data from `Coffee_export.csv`:
  - `the-roasting-b2b-coffee-final/src/data/coffeeProducts.js`
- Updated Products page to show local coffee data if Base44 returns nothing or fails:
  - `the-roasting-b2b-coffee-final/src/pages/Products.jsx`
- Updated Home page featured carousel to use local coffee data as fallback:
  - `the-roasting-b2b-coffee-final/src/pages/Home.jsx`
- Updated the sample request product checkbox list to use the real coffee catalogue instead of placeholder product names:
  - `the-roasting-b2b-coffee-final/src/components/connect/SampleRequestForm.jsx`

## Verified Data

- `Coffee_export.csv` has 11 products.
- Product image URLs from the coffee export were checked and returned HTTP 200.
- `PhotoGallery_export.csv` has 21 image rows.
- 20 of 21 gallery image URLs returned HTTP 200.
- Broken gallery image:
  - `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/santa_barbara_honduras.jpg`
  - It returned HTTP 400.
- Correct Honduras product image from `Coffee_export.csv` works:
  - `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/85c722d52_honduras-coffee_1200x800.jpg`

## Live Base44 Checks

The live Base44 deployment responded with HTTP 200 for:

- `https://the-roasting-b2b-coffee-final.base44.app/`
- `https://the-roasting-b2b-coffee-final.base44.app/Products`
- `https://the-roasting-b2b-coffee-final.base44.app/OurStory`
- `https://the-roasting-b2b-coffee-final.base44.app/Connect`
- `https://the-roasting-b2b-coffee-final.base44.app/PhotoGallery`

SwissTransfer command-line check returned HTTP 403, but the files are already downloaded locally.

## Not Production Ready Yet

The site can be deployed as a preview, but these should be fixed before production/client handoff:

1. Sample request form backend
   - The form still uses Base44 email integration:
     - `base44.integrations.Core.SendEmail`
   - This may fail on normal Vercel/Netlify/static hosting unless Base44 backend config is provided.
   - Recommended replacement: Netlify Forms, Formspree/Getform, or a serverless function using Resend, SendGrid, Mailgun, or SMTP.

2. Encoding issues
   - Several files show mojibake text like `cafÃ©`, `â€¢`, `â€”`, `â€¦`.
   - These should be cleaned before production.

3. Lint failures
   - `npm run lint` currently fails mostly because of unused imports.
   - Last check showed 33 errors and 2 warnings.

4. Broken gallery image
   - Replace `santa_barbara_honduras.jpg` with the working Honduras image URL from the coffee export.

## Deployment Notes

- If deploying the current export as-is, set environment variable:
  - `BASE44_LEGACY_SDK_IMPORTS=true`
- If moving away from Base44 fully:
  - Keep the local product data fallback or replace it with a new CMS/API.
  - Replace Base44 email integration in the sample request form.
  - Replace Base44 PhotoGallery loading with local gallery data or a new CMS/API.
