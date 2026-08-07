# The Roasting B2B Coffee

## Contact form email

The sample request form posts to `/api/contact`, which sends email through Resend.

Required server environment variables:

```env
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_EMAIL_TO=info@theroastingltd.co.uk
CONTACT_EMAIL_FROM=The Roasting <samples@theroastingltd.co.uk>
CONTACT_REPLY_TO=info@theroastingltd.co.uk
CONTACT_SEND_CONFIRMATION=true
```

`CONTACT_EMAIL_FROM` must use a domain verified in Resend before production sending will work.
