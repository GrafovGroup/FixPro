# FixPro implementation notes

The original source is preserved in master-prompt.md and ends at “webhook” in section 40.

- Separate Sites project, source repository, D1 database and R2 photo storage. No Turfy integrations or assets.
- Owner-private hosting. FixPro.ca DNS has not been connected.
- Placeholder phone is configured centrally in lib/config.ts as requested.
- Canonicals use the current Sites origin. Update config.origin during a future domain configuration step.
- Service/location architecture: /locations/{province}/{city}/{service}/. No competing city/service URL structure.
- Eight service categories, 16 specific repair services, ten provinces, 24 cities, ten industry pages, six broad service/city pages and 28 individually written specific repair/city pages. Other service/city routes activate only after adding a dedicated local content entry.
- Requests and contact messages save to the private requests table. Uploaded photos save to private R2 objects; there is no public photo retrieval route.
- The React forms use @formspree/react useSubmit to deliver submissions to https://formspree.io/f/mvkgzkqe after saving the existing private backup. Success is shown only after Formspree accepts the submission. All job/contact fields and optional photo attachments are sent. Delivery errors preserve input and allow retry; unchanged retries reuse the backup UUID, while edited retries create a new snapshot. Photo attachments require a Formspree plan with file uploads. No Turfy endpoint is used.
- No payment is collected and requests do not confirm appointments or authorize work.
- Photography is illustrative AI-created commercial imagery, not evidence of actual FixPro staff, offices or completed projects. Every one of the 58 service routes has its own original hero image via data/service-images.ts, with three responsive WebP sizes, descriptive alt text and eager priority loading. The home page and service-card imagery remain separate from this per-page collection. Prompts are preserved in reference/images/service-image-prompts.json.
- WebMCP exposes only staging a service category, never automatic submission.

Browser QA: service and contact submissions with photo storage, residential flow, failed-submit input preservation and retry, mobile navigation, and 320px layout passed. The original 71-page sitemap passed unique metadata and internal-link checks. The micro-service expansion is documented in seo-strategy.md. Native WebMCP was unavailable in the test browser, so its registered-tool execution could not be verified in a supported context.
