# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

BadBuy is a React Native (Expo) mobile app that helps users curb impulse spending by reframing prices as work hours. The full product spec, screen-by-screen behaviour, and database schema live in `docs/technical-documentation.md` — consult it for any architectural question or before adding/changing a feature. ADRs in `docs/decisions/` are the source of truth for locked-in tech choices (Supabase, Expo, Gluestack v3, NativeWind, hybrid-vertical folder structure).

Keep replies concise — short answers, no long code dumps unless asked.

## Commands

- `pnpm start` — Expo dev server (then choose Android / iOS / web from the terminal UI)
- `pnpm android` / `pnpm ios` / `pnpm web` — start a specific platform directly
- `pnpm lint` — `expo lint --max-warnings 0` (must pass with zero warnings)
- `pnpm prettier --check .` — formatting check (CI runs this)
- `pnpm build:web` / `build:android` / `build:ios` — `expo export` for the given platform
- `pnpm gluestack-add <component>` — install a Gluestack v3 component into `src/shared/components/ui`
- `pnpm prepare` — installs Husky hooks (run once after clone)

Package manager is **pnpm** (`packageManager: pnpm@10.33.0`); node version is pinned in `.nvmrc` (≥ 20.20.1). There is no test runner configured yet.

## Architecture

### Folder layout (per ADR-003 — hybrid vertical)

```
src/
  app/          # Expo Router routes ONLY. _layout.tsx + screen files. No logic.
    (auth)/     # Auth group — public routes (landing, login, register, onboarding)
    (app)/      # App group — gated routes (home, vault, profile…)
    _layout.tsx # Root: loads Nunito fonts, mounts AppProviders, hides splash
    index.tsx   # Redirects to (auth)/landing or (app)/home based on auth state
  features/     # Vertical slices. One folder per domain (auth, audit, vault, …).
                # Each slice owns: components/, hooks/, store.ts, service.ts,
                # utils.ts, types.ts. See src/features/template/ for the shape.
  providers/    # App-wide React providers (Gluestack, etc.)
  shared/       # Cross-cutting only — promote here ONLY when 2+ features need it.
    components/ui/  # Gluestack v3 primitives (added via `pnpm gluestack-add`)
    hooks/  services/  types/  utils/
supabase/       # migrations + Edge Functions (currently empty scaffolding)
example/        # Original Expo starter template — REFERENCE ONLY, not part of the app
```

**Import rule:** features may import from `shared/` freely and may read another feature's `types.ts`, but must never import another feature's components / hooks / store. If two features need the same thing, move it to `shared/`.

### Path aliases

Defined in both `tsconfig.json` (for the type-checker) and `babel.config.js` (for the bundler — `babel-plugin-module-resolver`). **Both must stay in sync** when adding aliases:

`@app/* @features/* @providers/* @shared/* @assets/* @example/*`

### Auth-gated routing

The redirect pattern is centralised in two places:

- `src/app/index.tsx` — root redirect based on `isLogged` from `@features/auth/store`
- `src/app/(app)/_layout.tsx` — guards the entire `(app)` group with the same check

`isLogged` is currently a hard-coded constant — wire it to the real Supabase session when implementing auth.

### Styling

NativeWind (Tailwind for React Native) + Gluestack UI v3. The Babel config sets `jsxImportSource: 'nativewind'` so `className` works on RN components. Global stylesheet entry is `global.css`, wired through Metro in `metro.config.js`. Light theme only for v1.

## Code conventions

- Import React types directly: `import { ReactNode } from 'react'`, not `React.ReactNode`.

### Screen composition

- Keep screen files (`src/app/`) thin — routing params, data wiring, and layout only. Delegate all rendering to feature components.
- Break each screen section into a named `*View` component inside `src/features/<name>/components/` (e.g. `AuditPriceView`, `AuditTimePriceView`).
- Sticky action bars at the bottom of a screen go in `ScreenContainer`'s `stickyBottom` prop, extracted as a `*StickyFooter` component (e.g. `AuditStickyFooter`).
- Never add top padding (`pt-*`) to the root View inside `ScreenContainer` — the container already provides vertical spacing.

### Feature public API

- Each feature exposes a root `index.tsx` that re-exports from its submodules (`./store`, `./components`, `./schemas`, etc.).
- **Always import from the feature root**, not from internal paths: `import { isLogged } from '@features/auth'`, not `@features/auth/store`.

### Icons

- Always pass an explicit `color` prop to Lucide icons — e.g. `color={themeColor.primary500}`. Do not rely on className or button context for icon color.

### Layout pitfalls

- **`minWidth: 0` on flex-1 text columns:** add `style={{ minWidth: 0 }}` to any `flex-1` View that contains `Text` next to non-flex siblings — without it React Native lets the text column bleed past its allocation.

### Navigation

- Use the object form for dynamic routes — `router.push({ pathname: '/(app)/vault/[id]', params: { id } })` — not template literals. This keeps params typed and avoids string interpolation errors.

### Shared general components

- Non-layout, non-UI-primitive shared components live in `src/shared/components/general/<component-name>/` with their own `index.ts` barrel.
- Each subfolder may contain `ComponentName.tsx`, `utils.ts`, `constants.ts` as needed — split logic out of the component file when it grows.

### Component design

- Derive boolean state from data inside the component rather than accepting it as a prop — e.g. compute `thawed` from `item.freeze_until` internally instead of receiving `thawed: boolean` from the parent.
- **Extend over duplicate:** add an optional prop to an existing component rather than creating a near-identical parallel component. `AuditStickyFooter` takes `freezeLabel?: string` (default `'Freeze'`); no `VaultStickyFooter` needed.
- **Formatter callbacks over static string props:** when a component renders text that callers need to customise, accept a `format*?: (value) => string` callback rather than a prefix/suffix prop. Example: `CountdownPill` exposes `formatExpireAtLabel?` so callers can produce `"Thaws in 5h 3m"` without new props.
- **Optional override params on utility functions:** add an optional `customRate?` parameter to conversion utils rather than creating a separate snapshot-rate variant. The live rate is the default; callers that have a frozen snapshot pass it explicitly.

## Conventions enforced by tooling

- **Commits** must follow Conventional Commits _and_ start with a lowercase letter (custom commitlint rule in `commitlint.config.js`). Husky's `commit-msg` hook enforces this.
- **Pre-commit** runs `lint-staged` (Prettier on everything, ESLint on `src/**/*.{js,jsx,ts,tsx}`) and `scripts/check-project-versions.js` (which fails if `package.json` `version` and `app.json` `expo.version` drift — bump them together).
- **Prettier** uses `@trivago/prettier-plugin-sort-imports`; import order is configured in `.prettierrc`. Don't manually reorder imports — let Prettier do it.
- **CI** (`.github/workflows/pr-checks.yml`) runs `expo-doctor`, `prettier --check`, `pnpm lint`, and `pnpm build:web` on every PR to `main`. Non-draft PRs only.

## Notes

- `dist/` is git-ignored build output and ESLint-ignored.
- `example/` and `src/features/template/` are scaffolds — copy the template structure when creating a new feature; don't import from `example/`.
- Documentation: `docs/technical-documentation.md` is the product/architecture spec; `docs/decisions/ADR-*.md` are the locked-in tech decisions; `docs/ui-designs/` holds AI-generated mockups.
