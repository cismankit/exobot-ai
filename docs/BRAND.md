# Exobod brand lockup

## What to use

| Asset | Path | Use |
| --- | --- | --- |
| Mark (SVG) | `legacy/web-v1/public/branding/mark.svg` · `apps/web/public/branding/mark.svg` | Favicon, app icon, social avatar |
| Lockup (SVG) | `…/public/branding/lockup.svg` | Deck covers, press, external embeds |
| React (live site) | `legacy/web-v1/components/brand-logo.tsx` → `BrandLockup` / `BrandMark` / `BrandWordmark` | Header, footer, in-app |
| React (apps/web) | `apps/web/components/marketing/logo.tsx` → `BrandLockup` / `LogoMark` / `BrandWordmark` | Nav, console, marketing |

Prefer the React components or SVG files. Raster PNGs under `public/branding/*.png` are legacy / OG fallbacks — do not use them in the header.

## Rules

1. **Do not stretch.** Keep the mark’s aspect ratio (`viewBox 0 0 40 48`). Size with height (`h-7`, `h-8`) and `w-auto`.
2. **Nav optical size.** Mark about 28–40px tall; wordmark `text-base` / `text-lg`. Gap ~10–12px.
3. **Colors.** Dark UI: white chassis (`#f5f7fa` / `text-main`) + orange accent `#ff7a1a` (live) or `--brand` `#f26a1b` (apps/web). Never purple gradients.
4. **Wordmark.** Always `Exobod` + orange `.ai`. Capital **E**; do not flatten to lowercase `exobod` in marketing chrome.
5. **One composition.** On marketing heroes, the brand lockup is a primary signal — not a tiny nav-only afterthought.

## Example

```tsx
import { BrandLockup } from "@/components/brand-logo"; // legacy/web-v1

<Link href="/" aria-label="Exobod.ai home">
  <BrandLockup size="md" />
</Link>
```

```tsx
import { BrandLockup } from "@/components/marketing/logo"; // apps/web

<BrandLockup markClassName="h-7 w-auto" wordmarkClassName="text-[17px]" />
```
