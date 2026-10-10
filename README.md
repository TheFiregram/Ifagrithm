# IFAGRITHM

Web3 Research & Business Services website built with Next.js and React.

## Development

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

Vercel runs the Next.js application using the included configuration. The main branch is the production source.

The page follows the layout and motion of https://striker.alphaai.markets/ using Ifagrithm's branding and research content.

It includes a 1 second brand entrance, 1 second hold, and 1.5 second circular exit with the current Web3 Research & Business Services descriptor; a static company headline with rotating supporting text and an animated dot field; four pinned capability panels with upright orbit labels, evidence flows, moving research cards and an animated ruler; the Desire, Behaviour, Business strategy; an animated business statement; a sector section with the connected signal field; seven accessible FAQs; a moving closing card wall; and an animated character footer. Shared company copy and capability definitions live in `lib/site-content.ts`.

Feature panels support wheel gestures, touch swipes, and keyboard navigation. Short screens and reduced motion use direct panel controls. Canvas effects and moving card columns pause off screen. New visitors start in light mode, independent of their device theme. A chosen dark or light theme is saved locally, applied before the first paint, and synced between tabs. The fixed glass header keeps the project enquiry link and theme switch accessible during scrolling. Geist is served locally with its font license.

Research cards illustrate possible outputs; they are not customer results or testimonials. Growth, partnership and custom work is assessed against the brief and delivery capacity, rather than presented as staffed departments or guaranteed outcomes.

The Book a Demo form validates required fields and submits to `/api/enquiries`. It shows success only after the store returns a valid saved receipt. Failed requests retain all answers and offer the verified contact email. Optional timing is included in the business question sent to the existing store schema. Demo requests require `IFG_STORE_URL`, `IFG_STORE_SECRET` and, for a private certificate, `IFG_CA_CERT` in the deployment environment. Restore the matching store secret before treating the preview as able to receive requests. A receipt confirms a saved request, not a scheduled appointment or email notification.

The member card studio at `/network` opens from an approved application's claim link. Approved names, roles, research desks and clearance tiers stay fixed; members can add their X photo, tagline and bio. The editor starts in light mode for new visitors and shares the site's saved theme preference. The glass header keeps its theme switch accessible. The responsive editor styles are separate from the card artwork, which keeps the same 1080 × 1350 PNG design in both themes. The public sample cannot be downloaded as an approved card.

## Verification

Use Node 22.18 or newer (CI uses Node 24). Install both dependency sets before running the regression suite:

```sh
npm ci
npm ci --prefix remote
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
npm audit --prefix remote
```

The suite uses disposable local PostgreSQL data via PGlite. It sends no real email and does not touch production records. GitHub runs these checks on pull requests and changes to main. The application and enquiry APIs validate JSON types, field lengths and request sizes; private API responses cannot be cached. Avatar downloads accept verified raster image types from approved hosts and reject SVG, unsafe redirects and oversized responses. The admin password must contain at least 16 characters. See SECURITY_REVIEW.md for findings, evidence and deployment limits.
