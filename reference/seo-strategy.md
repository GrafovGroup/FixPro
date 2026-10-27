# Specific repairs and Canadian city coverage

Added 16 focused service guides under `/services/{category}/{specific-repair}/` and 28 selected local guides under the existing `/locations/{province}/{city}/{specific-repair}/` hierarchy. Coverage spans all 24 listed cities, including newly added London, Ontario and Kitchener. The six earlier broad service/city pages remain intact.

Each specific repair guide explains symptoms, assessment scope, preparation, practical limits and two relevant FAQs. Each local guide adds an individually authored planning section and checklist. No cartesian product, keyword-swapped routes, invented office addresses, reviews, credentials, prices or arrival guarantees are generated. Unsupported combinations return 404.

The services index and category pages link to specific repairs; city hubs link to their authored local guides; specific repair guides link to their selected city guides. Local guides link back to their city, category, national guide and relevant sibling service. Each new page has its own title, description, self-canonical, social metadata, breadcrumbs and Service JSON-LD with the correct area. Service schema describes the page; it does not promise a Google rich result. The provider references the single Organization identity, without inventing LocalBusiness branches.

The request form remains on each specific repair page, prefilled with its category and (where applicable) city/province. The selected repair is stored in the existing payload and sent to Formspree as `specific_repair`, also appearing in the email subject. Changing the category clears the specific repair. General contact and service forms accept the default empty detail for backwards compatibility. No database migration is needed.

The sitemap includes canonical informational pages and excludes the noindex service-request route. No ranking, search-volume or indexed-page claim is made. These topic choices are based on existing service scope and job intent, not fabricated keyword metrics. English Quebec pages remain correctly marked as English; no hreflang is emitted without translated equivalents.

## Access and domain

The current Sites publication is owner-private. Google cannot crawl sign-in-protected content. Preserve that audience until the owner explicitly requests public access. FixPro.ca has not been connected; canonicals correctly use the actual Sites origin. A future domain change must update `lib/config.ts`, redirects and sitemap together. Search Console verification and sitemap submission require the owner's account/domain authorization and were not performed in this change.

## Editorial guidance consulted

- Google helpful-content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google doorway and scaled-content spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google canonical URL guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

Future expansion should add a service/city entry only where it provides useful job-specific context within actual service scope. Keep local availability qualifications; add real service evidence and verified business details when available.
