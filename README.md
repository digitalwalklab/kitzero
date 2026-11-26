# KitZero (킷제로) — Zero-Upload Image, PDF & Document Tools

> **남의 서버에 올리기 불안해서, 내가 쓰려고 만들었습니다.**  
> **Built because I didn't trust uploading my files to random servers.**

🌐 **Live Site**: https://kitzero.jokerx04.com/ ([한국어](https://kitzero.jokerx04.com/) · [English](https://kitzero.jokerx04.com/en/))

KitZero is a **100% client-side** suite of **21 free image, PDF, and document tools** built with Astro and TypeScript. Every file is processed strictly inside your browser memory—nothing is ever uploaded to or stored on an external server.

---

## Core Principles

- **Zero Server Uploads**: All conversions run locally in your browser (HTML5 Canvas, `pdf-lib`, `pdfjs-dist`, `heic2any`, `exifr`, `qrcode`, `jszip`).
- **Browser-Enforced Security**: Strict Content-Security-Policy (CSP), forced HTTPS, and zero backend/database attack surface.
- **No Sign-Up · No Watermarks · Free**: Open any tool and use it immediately. Close the tab and all session memory disappears.
- **Fast & Accessible**: Static Astro build (`53` KO/EN pages), lazy-loaded PDF/HEIC engines, inline CSS, dark/light theme, keyboard shortcuts (`/` search, `Ctrl+V` clipboard image paste), and PWA offline caching.

---

## Included Tools (21)

### Image Tools (8)
| Tool | Route | Highlights |
|---|---|---|
| **Image Compressor · WebP · EXIF** | [`/image-optimizer/`](https://kitzero.jokerx04.com/image-optimizer/) | Batch WebP/JPG/PNG compression, EXIF/GPS detection with strip or preserve toggle (JPEG & WebP), Before/After slider, ZIP export |
| **Batch Thumbnail Resizer** | [`/thumbnail-resizer/`](https://kitzero.jokerx04.com/thumbnail-resizer/) | YouTube (16:9), Blog OG (1200×630), Instagram (1:1·4:5·9:16), Naver presets, Cover/Contain/Fill, ZIP export |
| **Image Crop, Rotate & Flip** | [`/image-crop/`](https://kitzero.jokerx04.com/image-crop/) | Free/1:1/16:9/4:3/3:4 drag crop, 90° rotate, H/V flip |
| **Mosaic & Blur Redactor** | [`/image-blur/`](https://kitzero.jokerx04.com/image-blur/) | Drag-to-censor faces, plates & private info with cross-browser blur, pixel mosaic, blackout & undo |
| **iPhone HEIC Converter** | [`/heic-converter/`](https://kitzero.jokerx04.com/heic-converter/) | Batch `.heic`/`.heif` → JPG/WebP/PNG with lazy-loaded `heic2any` & ZIP download |
| **Batch Image Watermark** | [`/watermark/`](https://kitzero.jokerx04.com/watermark/) | Text or transparent PNG logo watermarks, 6 positions + diagonal tiled anti-theft pattern |
| **Combine & Stitch Images** | [`/image-merge/`](https://kitzero.jokerx04.com/image-merge/) | Vertical stack, horizontal row, or 2-column grid with auto-fit sizing & custom spacing |
| **Passport & ID Photo Cropper** | [`/id-photo/`](https://kitzero.jokerx04.com/id-photo/) | 35×45mm, 30×40mm, US 2×2", China Visa (300 DPI) with face alignment guide + 4×6 print sheet |

### PDF Tools (8)
| Tool | Route | Highlights |
|---|---|---|
| **Merge PDFs** | [`/pdf-merge/`](https://kitzero.jokerx04.com/pdf-merge/) | Reorder multiple PDFs and combine locally |
| **Split & Extract PDF** | [`/pdf-split/`](https://kitzero.jokerx04.com/pdf-split/) | Extract custom page ranges (`1-3, 5`) or split every page to ZIP |
| **PDF → PNG / JPG** | [`/pdf-to-image/`](https://kitzero.jokerx04.com/pdf-to-image/) | High-DPI (1.5x–3.0x) rendering with page range, cancel button & ZIP export |
| **Images → PDF** | [`/image-to-pdf/`](https://kitzero.jokerx04.com/image-to-pdf/) | Combine JPG/PNG/WebP photos into A4 or original-size PDF (`Ctrl+V` supported) |
| **Rotate, Delete & Reorder PDF** | [`/pdf-organize/`](https://kitzero.jokerx04.com/pdf-organize/) | Visual thumbnail cards to rotate 90°, reorder & delete pages without rasterizing |
| **Compress PDF Size** | [`/pdf-compress/`](https://kitzero.jokerx04.com/pdf-compress/) | Lossless structural optimization + 3-level scan compression with auto-smallest guard |
| **PDF Watermark & Page Numbers** | [`/pdf-watermark/`](https://kitzero.jokerx04.com/pdf-watermark/) | Diagonal Unicode/Korean text stamp + bottom page numbers (`1 / N`) |
| **Sign & Stamp PDF** | [`/pdf-sign/`](https://kitzero.jokerx04.com/pdf-sign/) | Hand-drawn signature pad or transparent PNG stamp placed directly on any page |

*(All 7 PDF tabs are also accessible from the unified hub at [`/pdf-tools/`](https://kitzero.jokerx04.com/pdf-tools/).)*

### Web & Document Utilities (5)
| Tool | Route | Highlights |
|---|---|---|
| **Local QR Code Generator** | [`/qr-generator/`](https://kitzero.jokerx04.com/qr-generator/) | Permanent URL, text & Wi-Fi QR codes with optional center logo (PNG & SVG) |
| **Favicon & App Icon Generator** | [`/favicon-generator/`](https://kitzero.jokerx04.com/favicon-generator/) | Multi-size `favicon.ico` binary + Apple/Android PNGs + `site.webmanifest` + HTML tags ZIP |
| **SVG → PNG / WebP Converter** | [`/svg-converter/`](https://kitzero.jokerx04.com/svg-converter/) | Upload `.svg` or edit raw SVG markup live and export up to 4096px |
| **Word & Character Counter** | [`/word-counter/`](https://kitzero.jokerx04.com/word-counter/) | Characters (w/ & w/o spaces), 2-byte EUC-KR & UTF-8 bytes, words, reading time & top 5 terms |
| **Image Color Picker & Palette** | [`/color-picker/`](https://kitzero.jokerx04.com/color-picker/) | Click/tap pixel eyedropper (HEX/RGB/HSL) + automatic 8-color dominant palette |

---

## Tech Stack & Project Structure

- **Framework**: [Astro 5](https://astro.build) (static output, zero runtime JS on content pages)
- **Client Engines** *(all MIT / Apache-2.0)*: `pdf-lib`, `pdfjs-dist` (local worker), `heic2any`, `jszip`, `exifr`, `qrcode`
- **Styling**: Modular CSS (`src/styles/tokens.css`, `layout.css`, `components.css`)
- **Single Source of Truth**: `src/i18n/toolRegistry.ts` powers navigation, breadcrumbs, and `sitemap.xml`

```text
src/
├── components/   # Astro UI views (21 tools + Home, Legal, SEO Guide, CategorySubNav)
├── i18n/         # Bilingual (ko/en) copy, guides, and toolRegistry.ts
├── layouts/      # BaseLayout.astro (CSP, JSON-LD, hreflang, header/drawer, skip-link)
├── pages/        # Static routes (/, /en/, /404, /sitemap.xml, /rss.xml, /en/rss.xml)
├── scripts/      # Pure TypeScript tool logic, shared utils.ts & lazy pdf-loaders.ts
└── styles/       # tokens.css, layout.css, components.css, global.css
tests/
└── core.test.ts  # Node native unit tests (parsePageRanges, EXIF binary, registry)
```

---

## Development & Deployment

```bash
npm install
npm run dev      # Start local dev server (http://localhost:4321)
npm test         # Run unit tests (Node built-in test runner)
npm run check    # TypeScript & Astro diagnostics
npm run build    # Build static site into dist/
```

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages on every push to `main`.
