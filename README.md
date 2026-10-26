# vizune-studio

The coming-soon splash page for **vizune.com**, the home of Vizune Game Studio.

It's plain HTML, CSS and a small amount of vanilla JS, with no build step and no dependencies. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages, Nekoweb…).

Branding, colours, illustrations and typography follow the **Vizune Brand Guideline** by Cloverie Design.

```
index.html          the page
css/style.css       all styles, with brand colours as CSS variables in :root
js/main.js          sign-up form handling and footer year
js/logo-anim.js     the animated logo (click to replay)
assets/img/         web-optimised brand assets (WebP), favicon, social card
assets/fonts/       Chubby Gum webfont (licensed via MyFonts)
favicon.ico
```

## Before launch checklist

- [x] **Chubby Gum webfont licence.** Bought and installed.
- [ ] **Email sign-up endpoint.** Set `data-endpoint` on the form (see below).
- [ ] **Domain.** The social-card tags assume `https://vizune.com/`.

## Fonts

| Role | Font | Source |
| --- | --- | --- |
| Headlines | **Chubby Gum** by Agny Hasya Studio | Licensed MyFonts webfont (annual, 10k page views/month), self-hosted in `assets/fonts/` |
| Body | **Roboto Mono** | Free (OFL), loaded from Google Fonts |

- Keep the MyFonts `@license` comment at the top of `css/style.css`. The webfont licence requires it.
- The Chubby Gum webfont licence covers **vizune.com only** and renews every year. Don't reuse these font files on other sites (such as Vizune Reviews) without a separate licence.
- **Optional: self-host Roboto Mono.** For a page with no third-party requests, download Roboto Mono from Google Fonts. Put the `.woff2` files in `assets/fonts/`, add `@font-face` rules for them, and remove the Google Fonts `<link>` tags.

## Email sign-up

The form posts the email address (as `FormData`, field `email`) to whatever URL is in `data-endpoint`:

```html
<form class="signup" id="signup" data-endpoint="https://YOUR-PROVIDER/endpoint" novalidate>
```

That works with services that accept a plain form POST and allow cross-origin requests, such as Formspree, Buttondown, Kit (ConvertKit) or Netlify Forms.

- A 2xx response shows the "You're on the list!" state. Anything else shows a friendly retry message.
- With no endpoint set, the form says "Sign-ups open very soon" and logs a console warning. Nothing gets lost silently.
- A hidden honeypot field (`website`) quietly drops bot submissions.

## Assets used

All files come from `VIZUNE FINAL FILES/PNG`. They were cropped, resized to about 2× display size and converted to WebP.

| File | Source |
| --- | --- |
| `vizune-logo.webp` | Primary logo (original ver – sticker style – green backgr) |
| `moon-star-cream.webp` / `moon-star-pink.webp` | Moon & Star (white / pink sticker ver) |
| `potion-jade.webp` | Potion Bottle (green sticker ver) |
| `teapot-jade.webp` | Teapot (green sticker ver) |
| `swirl-lilac.webp` / `swirl-pink.webp` | Swirl (light purple / pink sticker ver) |
| `mascot-cream.webp` | Full body mascot (white sticker ver) |
| `mascot-head-cream.webp` | Brand mark (white sticker ver) |
| `pattern.webp` | Brand pattern (transparent ver), used as a faint background texture |
| `favicon*`, `apple-touch-icon.png` | Brand mark (green sticker ver) |
| `og-image.png` | Social share card (1200×630) composed from the above |

## Logo animation

The hero logo is an inline SVG built from Cloverie's vector artwork (`Vizune primary logo (sticker ver).ai`), with each letter, the sparkle, the cat's head and the paws as separate shapes. It plays on load and replays when clicked:

1. **VZN** pops in.
2. The letters open out like an accordion as **i**, **u** and **e** unfold, and the orange sparkle spins onto the i.
3. The cat's ears peek over the letters, do a curious wiggle, then the whole head pops up and the eyes twinkle.
4. The paws plop onto the text, and the logo settles onto the official jade sticker outline.

While the animation plays, each moving piece has a jade-stroked copy behind it that moves in sync, so the outline stretches smoothly with the letters. At rest, the page shows Cloverie's exact outline. Timings are in `js/logo-anim.js`, which uses the Web Animations API with no libraries.

`assets/img/vizune-logo.webp` is no longer used on the page. It's kept as a handy static copy of the logo.

## Accessibility and motion

- Decorative artwork is hidden from screen readers. The logo has alt text, and the form has a proper label and live status messages.
- All floating and twinkling animation turns off for visitors with `prefers-reduced-motion` set. They see the finished logo straight away, and clicking it gives a tiny wiggle instead of the full sequence.
- The logo is a real `<button>`, so you can replay it with the keyboard (Enter or Space).
- The layout is responsive down to 320px wide.
