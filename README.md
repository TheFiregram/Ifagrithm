# IFAGRITHM

Web3 research and intelligence website built with Next.js and React.

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

It includes a 1 second brand entrance, 1 second hold, and 1.5 second circular exit; a rotating headline and animated dot field; five pinned feature panels with upright orbit labels, evidence flows, moving research cards, an animated ruler, and a connected signal field; a three-stage research process; rolling counters; an accessible FAQ; a moving closing card wall; and an animated character footer.

Feature panels support wheel gestures, touch swipes, and keyboard navigation. Short screens and reduced motion use direct panel controls. Canvas effects and moving card columns pause off screen. New visitors start in light mode, independent of their device theme. A chosen dark or light theme is saved locally, applied before the first paint, and synced between tabs. The fixed glass header keeps the demo link and theme switch accessible during scrolling. Geist is served locally with its font license.

The counters describe the four research areas, three stages, and one decision being studied. Research cards illustrate possible outputs; they are not customer results or testimonials.

The enquiry form validates the required fields and opens the visitor's email app with a complete draft addressed to Ifagrithm@gmail.com. Visitors review and send the draft in their email app. The form keeps their answers and offers links to reopen the draft or compose it in Gmail. It does not claim delivery or depend on the network store. No enquiry is sent automatically.
