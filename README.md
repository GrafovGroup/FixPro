# FixPro

Standalone Canadian repair and maintenance website. The original requirements are preserved in `reference/master-prompt.md`; operational choices are documented in `reference/implementation-notes.md`.

## Development

Run the Sites dependency installer, then `npm run dev`. Run `npm run build` for the Cloudflare Worker build. The stack uses React, TypeScript, Tailwind and the Sites Vinext implementation of the Next.js app router.

## Content

- `data/services.ts`: initial repair categories and future category inventory.
- `data/locations.ts`: ten provinces and 24 priority cities.
- `data/local-services.ts`: individually authored service/city content. Only these curated combinations are published.
- `data/micro-services.ts`: 16 specific repair guides within the eight service categories.
- `data/local-micro-services.ts`: 28 individually authored repair/city pages across 24 cities.
- `data/industries.ts`: industry content.
- `data/service-images.ts`: one unique hero image per service route; responsive assets in `public/images/services/` and generation prompts in `reference/images/service-image-prompts.json`.
- `lib/config.ts`: business name, phone and current canonical origin.

## Request storage

`POST /api/requests` validates requests and stores structured information in D1 and private image uploads in R2. Both the service workflow and contact form use this endpoint. The source UUID is an idempotency key. The endpoint never exposes stored request details. React forms then deliver named job/contact fields and photo attachments to the FixPro Formspree endpoint `https://formspree.io/f/mvkgzkqe` using `@formspree/react` (`useSubmit`). Success requires Formspree acceptance; errors retain the draft for retry. Formspree account settings control notifications, spam protection and attachment support.

Generate schema changes with `npm run db:generate`, then inspect the migration. Existing deployed migrations are immutable. Local test records are isolated from hosted records.

## Hosting

Publish through Sites with the project identifier in `.openai/hosting.json`. The Site is public at https://fixpro.ca. Preserve its current public audience. Do not modify the Turfy project or reuse its form destination.

The configured phone is (833) 696-9996. Update it centrally in lib/config.ts when instructed. Site visitors must receive only truthful availability and service qualifications, without invented offices, credentials, reviews or guaranteed response times.

## Bilingual content and verification

- English routes retain their URLs. Each has a French equivalent under `/fr/`, including service categories, specific repairs, curated local pages, industries and inquiry forms.
- `data/french.ts` contains French service, repair, industry and local planning copy. `app/fr/[[...slug]]/page.tsx` renders the French pages. `lib/resolve-page.ts` is the shared route inventory.
- Language switches retain the equivalent route. Metadata and the sitemap declare reciprocal `en-CA`/`fr-CA` alternates. Middleware sets the server-rendered HTML language.
- Forms include the inquiry language in stored records and Formspree fields. No live customer information belongs in this repository.
- After building, run `node scripts/verify-site.mjs` to test the compiled Worker with isolated, temporary D1/R2 storage. Tests do not send Formspree email.
- Keep the production environment, D1 records, R2 customer uploads and Formspree account configuration separate from the source backup.
