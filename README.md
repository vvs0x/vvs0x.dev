# vvs0x.dev

Personal site of Valentín Schwarz. React 19, TypeScript, Vite, React Router. No UI framework, styling via CSS Modules.

## Development

```sh
npm install
npm run dev      # local dev server
npm run lint     # eslint
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Content

All content lives in `src/data/`:

- `site.ts` holds name, email, social links and the CV path used by navbar and footer.
- `projects.ts` feeds the Projects grid and `/projects/<id>`.
- `playground.ts` feeds the Playground grid and `/playground/<id>`.

An entry with a `body` and a `date` gets a detail page and its card becomes a link. The `body` is a list of sections, each with a `heading` and its `paragraphs`; the headings form the side menu of the detail page. An entry without a body is a placeholder: its card is not clickable and shows "Coming soon" instead of the date. Optional fields: `image` (put the file in `public/images/`), `color` (swatch when there is no image), `links` (shown below the body).

Dates are ISO strings (`YYYY-MM-DD`) and are formatted at render time. The `id` is the URL slug.

## Deployment

The site is deployed to GitHub Pages at https://vvs0x.dev via `.github/workflows/deploy.yml` on every push to `main`.

One-time setup in the repository settings:

1. Pages → Source: **GitHub Actions**.
2. Pages → Custom domain: `vvs0x.dev` (the `public/CNAME` file keeps it across deploys). Enable "Enforce HTTPS" once the certificate is issued.
3. DNS at your registrar: four `A` records for `vvs0x.dev` pointing to GitHub's Pages IPs, and a `CNAME` for `www` pointing to `<user>.github.io`.

Deep links work because the build writes a copy of `index.html` to `404.html`, which GitHub Pages serves for unknown paths.
