# vvs0x.dev

Personal portfolio. React 19, TypeScript, Vite, React Router, CSS Modules. Deployed to GitHub Pages (see README).

```sh
npm run dev     # local dev server
npm run lint    # eslint
npm run build   # type-check + production build
```

Content lives in `src/data/` (`projects.ts`, `playground.ts`, `site.ts`). Entry images live in `public/images/`.

## Images for Projects and Playground

Cards and detail pages show the image at its own proportions, and the
grid is tuned for **16:10**. Other proportions work, but they leave white
space in the large card and make the two small cards uneven.

| | Value |
|---|---|
| Aspect ratio | **16:10** |
| Size | **3000 × 1875 px** (at least 2000 × 1250 px) |
| Format | WebP, no metadata |
| File size | about 100–400 KB |
| File name | `public/images/<name_with_underscores>.webp` |

Why 3000 px: the large card is about 930 px wide on a 1512 px screen, so
about 1860 px on Retina. 3000 px leaves room and matches the existing
images.

### Screenshots of a window (macOS)

1. Make the browser window about **1500 × 938 pt**. On a Retina screen
   that gives 3000 × 1876 px, i.e. 16:10.
2. `Cmd + Shift + 4`, then `Space`, then **hold `Option` and click** the
   window. Without `Option` macOS adds a transparent shadow around the
   window, which has to be cropped away afterwards.
3. Convert:
   ```sh
   cwebp -q 82 -resize 3000 0 screenshot.png -o public/images/name.webp
   ```

The rounded window corners stay transparent; that is intended.

### Photos

Crop to 16:10 first, then:

```sh
cwebp -q 80 -resize 3000 0 photo.jpg -o public/images/name.webp
```

`cwebp` drops EXIF data (camera, GPS) by default. Keep it that way.

### In the data file

`width` and `height` must be the real pixel size of the file. Check with:

```sh
sips -g pixelWidth -g pixelHeight public/images/name.webp
```

The `alt` text describes what the image shows.
