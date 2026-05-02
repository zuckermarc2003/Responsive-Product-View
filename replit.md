# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### API Server (`artifacts/api-server`)
Express 5 REST API. Currently only has a `/api/healthz` route.

### AL-FIRDAOUS STORE — Mobile App (`artifacts/al-firdaous-mobile`)
Expo/React Native mobile app for the AL-FIRDAOUS shoe store (Arabic RTL e-commerce).

**Tech:** Expo Router, React Query, AsyncStorage (cart/wishlist), Reanimated animations, Ionicons

**Screens:**
- `app/(tabs)/index.tsx` — Home: hero banner, category pills, new arrivals + on-sale carousels, full product grid
- `app/(tabs)/catalog.tsx` — Catalog: search + filter by category + sort, 2-col product grid
- `app/(tabs)/cart.tsx` — Cart: line items with qty controls, order summary, checkout
- `app/(tabs)/wishlist.tsx` — Saved products grid
- `app/(tabs)/profile.tsx` — Store info, settings (language toggle, notifications), stats
- `app/product/[id].tsx` — Product detail: image gallery, size selector, add to cart, reviews, related products

**State:**
- `context/CartContext.tsx` — AsyncStorage-persisted cart
- `context/WishlistContext.tsx` — AsyncStorage-persisted wishlist

**Data:** `constants/data.ts` — 16 mock products (Shoes, Sandals, Shirts, Pants) with Unsplash images. Replace with real API when ready.

**Brand colors:** Blue `#0e92e4`, Green `#16a34a`, Red `#ef4444`

### Drop-in CSS fixes (`attached_assets/`)
Enhanced CSS/TSX files for the web project (AL-FURQA / AL-FIRDAOUS web store):
- `ProductCarousel_enhanced.css/tsx` — Carousel overflow fix, RTL-safe animations
- `ProductDetail_enhanced.css` — Mobile image layout (column-reverse)
- `footer_enhanced.css/tsx` — Footer overflow fix
- `global_mobile_fix.css` — Bootstrap container padding fix (root cause of right-side gap on mobile)
