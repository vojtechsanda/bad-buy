# BadBuy — Technical Documentation

| Field             | Value                                                                |
| ----------------- | -------------------------------------------------------------------- |
| **Product**       | BadBuy                                                               |
| **Version**       | v1 (MVP)                                                             |
| **Document Type** | Technical Documentation                                              |
| **Audience**      | Engineering team, AI design agents (Stitch, Claude Design, UX Pilot) |
| **Status**        | Source of truth for v1 implementation and Hi-Fi design               |
| **Date**          | 2026-05-03                                                           |

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Information Architecture & Navigation](#3-information-architecture--navigation)
4. [Design System](#4-design-system)
5. [Data Model](#5-data-model)
6. [Premium & Referral System](#6-premium--referral-system)
7. [Gamification — Levels & Decisions](#7-gamification--levels--decisions)
8. [Currency, Conversion & Work-Hours Logic](#8-currency-conversion--work-hours-logic)
9. [Notifications](#9-notifications)
10. [Screen Specifications](#10-screen-specifications)
11. [Reusable Components & Patterns](#11-reusable-components--patterns)
12. [Empty, Loading & Error States](#12-empty-loading--error-states)
13. [Asset Inventory](#13-asset-inventory)
14. [Out of Scope for v1](#14-out-of-scope-for-v1)
15. [Open Decisions & Future Work](#15-open-decisions--future-work)

---

## 1. Product Overview

### 1.1 What BadBuy Is

BadBuy is a mobile application (Android primary, iOS supported) that helps users curb impulse spending through psychological reframing and gentle gamification. Instead of telling the user what to do, BadBuy shows the user the _true cost_ of a purchase by:

- Converting the price into hours of their personal work time.
- Suggesting alternative purchases the user could make for the same money, tailored to their hobbies and country.
- Allowing the user to "freeze" a decision and revisit it later, with a notification at the chosen time.
- Tracking every decision (skip, buy, freeze) to build a sense of mindful spending progress over time.

The product is intentionally non-judgmental. A "buy" decision is not punished — it is treated as a mindful, informed choice. The only celebrated moment is the "skip" decision, because that's when the app has helped the user most directly.

### 1.2 Design Philosophy

The app's overall character is calm and minimal — closer to Headspace or Calm than to a banking app or a Duolingo-style streak machine. Generous whitespace, soft colors, friendly rounded typography, gentle micro-interactions.

The single exception is the **skip celebration page**, which goes joyful and bold (confetti, illustration, vibrant colors). This contrast makes the moment feel earned and meaningful.

### 1.3 Core User Loop

1. User registers and completes onboarding (name, location, currency, wage, hobbies).
2. On the home screen, user enters a price they're considering spending.
3. The app shows the **audit page**: how many work hours that price represents, plus 5 alternative purchases tailored to their hobbies and country.
4. User chooses one of three actions:
   - **Skip** (swipe-to-unlock gesture) → celebration page → back to home.
   - **Buy** (tap) → calm send-off page → back to home.
   - **Freeze** (tap, then choose duration) → item added to vault, notification scheduled.
5. When a frozen item's timer expires, the user gets a push notification + in-app notification entry. Tapping it reopens the audit page for that item, where they can finally decide skip or buy (or re-freeze).
6. Every skip and buy increments the user's **decision count**, which feeds the leveling system. Total saved is the sum of all skipped item prices.

### 1.4 Constraints That Shape the Product

- **Timeline:** ~1 month to a working product (latest revised scope).
- **Team:** 3 people, no dedicated designer, strong React + TypeScript + web frontend skills.
- **Stack:** Locked-in (React Native + Expo + Gluestack UI v3 + Supabase, see ADRs 001–005).
- **Design tooling:** Hi-Fi mockups will be produced with AI design tools (Stitch, Claude Design, UX Pilot). All visuals must be describable in prose.
- **Component reuse:** Gluestack UI v3 components used as-is wherever possible. Minimal reskinning. Custom components only where Gluestack has no equivalent.

---

## 2. Tech Stack

### 2.1 Locked-In Decisions (from ADRs)

| Concern           | Choice                                                       | Source  |
| ----------------- | ------------------------------------------------------------ | ------- |
| Mobile framework  | React Native with Expo (managed workflow)                    | ADR-002 |
| Backend           | Supabase (PostgreSQL + Auth + Edge Functions + pg_cron)      | ADR-001 |
| Folder structure  | Hybrid Vertical (feature slices + shared layer)              | ADR-003 |
| Database schema   | Denormalized per-user, USD as base currency, daily rate sync | ADR-004 |
| Styling           | NativeWind (Tailwind for React Native)                       | ADR-005 |
| Component library | Gluestack UI v3                                              | ADR-005 |

### 2.2 Additional Stack Choices (this document)

| Concern              | Choice                                                                                                                            | Reason                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Routing              | Expo Router (file-based)                                                                                                          | Mandated by ADR-003                                               |
| State management     | Zustand                                                                                                                           | Simple, hooks-based, no boilerplate                               |
| Server state / cache | TanStack Query                                                                                                                    | Pairs well with Supabase calls, handles loading/error/refetch     |
| Icons                | Lucide React Native                                                                                                               | Matches Gluestack mental model, free, comprehensive               |
| Animations           | `react-native-reanimated` (UI thread), `lottie-react-native` (confetti, hero animations), `moti` (declarative micro-interactions) | Per ADR-002                                                       |
| Haptics              | `expo-haptics`                                                                                                                    | Built-in to Expo, used for swipe-to-unlock feedback               |
| Push notifications   | `expo-notifications`                                                                                                              | Built-in to Expo, scheduled local notifications for freeze timers |
| Image input (future) | `expo-image-picker`                                                                                                               | Out of scope for v1                                               |
| Theme                | Light theme only for v1                                                                                                           | Dark theme deferred to v2                                         |
| Localization         | English only for v1                                                                                                               | i18n deferred to v2                                               |

### 2.3 Folder Structure

Per ADR-003, hybrid vertical:

```
app/                          # Expo Router routes ONLY
  (auth)/                     # Auth-only routes
    landing.tsx
    login.tsx
    register.tsx
    onboarding/
      _layout.tsx
      identity.tsx
      money.tsx
      hobbies.tsx
      promo.tsx               # Conditional, only if user said they have a code
  (app)/                      # Logged-in routes
    _layout.tsx               # Bottom tab nav
    home.tsx
    audit.tsx
    skip.tsx
    buy.tsx
    vault/
      index.tsx
      [id].tsx                # Re-uses audit screen
    profile/
      index.tsx
      hobbies.tsx
  _layout.tsx
  index.tsx                   # Routes to landing or home based on auth state

src/
  features/
    auth/                     # login, register, session
    onboarding/               # onboarding flow logic
    home/                     # home screen state, price input
    audit/                    # audit screen, suggestions, work-hours logic
    decision/                 # skip/buy/freeze actions, leveling effects
    vault/                    # frozen items list, item state
    notifications/            # in-app notification feed
    profile/                  # profile screen, settings
    premium/                  # premium status, redemption, upsell
    referral/                 # user's own referral code, sharing
  shared/
    components/               # design system: Button, Card, BottomSheet, etc.
    hooks/                    # useCurrency, useHaptics, useAuthSession, etc.
    services/
      supabase.ts
      edge-functions.ts
    utils/                    # formatPrice, computeWorkHours, etc.
    types/                    # global types

supabase/
  migrations/
  functions/
    generate-suggestions/     # Edge Function: AI-generated alternatives
    sync-currency-rates/      # Cron: daily rate sync (or via pg_cron)
    moderate-custom-hobby/    # Async moderation of user-submitted hobby names
```

---

## 3. Information Architecture & Navigation

### 3.1 Auth State Routing

The root `index.tsx` checks the Supabase session and routes:

| Auth State    | Onboarding Complete | Routed To              |
| ------------- | ------------------- | ---------------------- |
| Not logged in | —                   | `/landing`             |
| Logged in     | No                  | `/onboarding/identity` |
| Logged in     | Yes                 | `/home`                |

### 3.2 Navigation Shells

The app has **two navigation shells** plus several full-screen overlays:

**Shell A — No-chrome shell** (used for: landing, login, register, all onboarding steps, skip, buy)

- No bottom tab bar.
- No top app bar with notification bell.
- Each screen is responsible for its own back button if applicable (login, register only).
- Onboarding steps show a step progress bar at the top instead of a back button.

**Shell B — App shell** (used for: home, audit, vault, vault item detail, profile, profile sub-screens)

- Persistent **bottom tab bar** with three tabs: **Vault** (left), **Home** (center, primary), **Profile** (right).
- Persistent **top app bar** with the notification bell icon in the top right. App bar background is the screen background color (no shadow); only the bell icon shows.
- The Home tab is visually the central/primary tab, but all three tabs are equally accessible.

**Full-screen overlays** (no shell): the **skip page** and **buy page**. These are routed pages, not modals — the user navigates _to_ them, sees them in full, then taps Continue to navigate to home. There is no back navigation from these pages.

### 3.3 Bottom Tab Bar

| Tab     | Icon (Lucide) | Label   | Route      |
| ------- | ------------- | ------- | ---------- |
| Vault   | `Snowflake`   | Vault   | `/vault`   |
| Home    | `Home`        | Home    | `/home`    |
| Profile | `User`        | Profile | `/profile` |

Active tab: filled icon + accent color label. Inactive: outline icon + muted label. Center tab is the default landing tab after onboarding/login.

### 3.4 Top App Bar (Shell B only)

- Left: screen title (e.g., "Home", "Vault", "Profile") in the brand display weight, or empty on home (greeting acts as the title).
- Right: notification bell icon (Lucide `Bell`). If unread notifications exist, a small dot badge in the accent color appears on the bell.
- Tapping the bell opens the notifications bottom sheet (see Section 9).

### 3.5 Modal & Sheet Patterns

Bottom sheets (Gluestack `Actionsheet`) are used for:

- Currency picker
- Country picker
- Freeze duration picker (predefined chips + custom input)
- Promo code redemption
- Premium upsell
- Personal info edit
- Notifications panel
- Logout & delete account confirmations
- Successful redemption celebration

Center modals are not used in v1. All popovers are bottom sheets.

### 3.6 Full Screen Map

```
PUBLIC (Shell A)
├── /landing                    Landing page
├── /login                      Login
├── /register                   Register (with optional "I have a code" link)
└── /onboarding
    ├── /identity               Step 1: name + birthdate + country
    ├── /money                  Step 2: display currency, wage, wage currency, work hours/day
    ├── /hobbies                Step 3: hobby selection (and "I have a code" link)
    └── /promo                  Conditional Step 4: promo code input

APP (Shell B)
├── /home                       Home — price input
├── /audit                      Audit page (after price entered)
├── /vault                      Frozen items list
├── /vault/[id]                 Frozen item detail (re-uses audit UI)
├── /profile                    Profile + settings
└── /profile/hobbies            Hobbies edit sub-screen

FULL SCREEN (no shell)
├── /skip                       Skip celebration page
└── /buy                        Buy send-off page

BOTTOM SHEETS (overlays on current screen)
├── Notifications panel
├── Currency picker
├── Country picker
├── Freeze duration picker
├── Promo code redemption
├── Premium upsell
├── Personal info edit
├── Successful redemption celebration
├── Logout confirmation
└── Delete account confirmation
```

### 3.7 Back Navigation Rules

| From                    | Back Behavior                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing                 | None (root screen)                                                                                                                                                                                       |
| Login                   | Back to landing                                                                                                                                                                                          |
| Register                | Back to landing                                                                                                                                                                                          |
| Onboarding step N (N>1) | Back to step N-1 (no skip-back across "I have a code" branch)                                                                                                                                            |
| Onboarding step 1       | Back to register/login (Supabase logout, since incomplete onboarding implies the user isn't really "in" yet — alternative: forbid back; **chosen: forbid back during onboarding to prevent state loss**) |
| Home                    | None (root tab)                                                                                                                                                                                          |
| Audit                   | Back to home (allowed — user may have mistyped)                                                                                                                                                          |
| Skip                    | None — only forward to home via Continue                                                                                                                                                                 |
| Buy                     | None — only forward to home via Continue                                                                                                                                                                 |
| Vault                   | None (root tab)                                                                                                                                                                                          |
| Vault item detail       | Back to vault list                                                                                                                                                                                       |
| Profile                 | None (root tab)                                                                                                                                                                                          |
| Profile sub-screens     | Back to profile                                                                                                                                                                                          |
| Any bottom sheet        | Dismiss via swipe-down or backdrop tap                                                                                                                                                                   |

---

## 4. Design System

### 4.1 Visual Identity

Calm, warm, gently illustrative. The closest aesthetic references are Headspace, Calm, Finch (without the mascot), and the "soft modern" Notion-adjacent style. Generous whitespace. Soft rounded corners. No harsh shadows. No sharp contrast. Single celebratory moment (skip page) that breaks the calm with confetti and bright colors.

### 4.2 Color Palette

Light theme only for v1. Defined as Tailwind CSS variables in `tailwind.config.js` so Gluestack and NativeWind both consume them.

#### Primary palette

| Token         | Hex       | Use                                                             |
| ------------- | --------- | --------------------------------------------------------------- |
| `primary-50`  | `#F0F7F5` | Soft tinted backgrounds                                         |
| `primary-100` | `#D9EBE5` | Hover/pressed surfaces                                          |
| `primary-300` | `#7FB8A7` | Disabled primary                                                |
| `primary-500` | `#3E8F7C` | **Brand primary** — primary CTAs, active tab, progress bar fill |
| `primary-700` | `#2A6557` | Pressed primary, primary text on light bg                       |
| `primary-900` | `#1A3F36` | Dark accent for typography                                      |

A soft sage-teal. Calm, warm, money-adjacent without being literal "dollar green."

#### Accent palette (CTAs, energy, level badges)

| Token        | Hex       | Use                                                            |
| ------------ | --------- | -------------------------------------------------------------- |
| `accent-100` | `#FCE9E0` | Soft accent backgrounds                                        |
| `accent-500` | `#E89B7A` | **Accent** — secondary CTAs, level badges, level-up highlights |
| `accent-700` | `#C97554` | Accent pressed state                                           |

A warm coral/peach. Friendly, not alarming. Used sparingly.

#### Celebration palette (skip page only)

| Token              | Hex       | Use                                        |
| ------------------ | --------- | ------------------------------------------ |
| `celebrate-yellow` | `#F9C846` | Confetti, skip page accents                |
| `celebrate-pink`   | `#F47BA0` | Confetti                                   |
| `celebrate-teal`   | `#5DC9B6` | Confetti, savings amount text on skip page |

Used **only** on the skip page. Never elsewhere.

#### Neutrals

| Token            | Hex       | Use                                             |
| ---------------- | --------- | ----------------------------------------------- |
| `bg`             | `#FBF9F5` | App background (warm off-white, not pure white) |
| `surface`        | `#FFFFFF` | Card surfaces                                   |
| `surface-alt`    | `#F4F1EB` | Alternate surface for nested content            |
| `border`         | `#E8E2D6` | Hairline borders, dividers                      |
| `text-primary`   | `#2C2A26` | Body text (warm dark, not pure black)           |
| `text-secondary` | `#6B6660` | Captions, secondary labels                      |
| `text-tertiary`  | `#9A938A` | Placeholders, disabled text                     |
| `text-inverse`   | `#FBF9F5` | Text on primary/accent fills                    |

#### Semantic

| Token     | Hex       | Use                                  |
| --------- | --------- | ------------------------------------ |
| `success` | `#3E8F7C` | (= primary) Success states           |
| `warning` | `#E5A93C` | Premium expiry warnings (none in v1) |
| `danger`  | `#C45757` | Delete account, destructive actions  |
| `info`    | `#5B8DB8` | Info icons during onboarding         |

### 4.3 Typography

Single typeface family for v1: **Nunito** (Google Fonts, free, rounded geometric sans, friendly and calm). Loaded via `expo-font`.

If Nunito proves heavy on bundle size or has rendering issues, fallback is **DM Sans**.

| Token        | Size / Line | Weight         | Use                                                    |
| ------------ | ----------- | -------------- | ------------------------------------------------------ |
| `display-xl` | 36 / 44     | 800 (Black)    | Skip page amount, hero numbers                         |
| `display-lg` | 28 / 36     | 800            | Onboarding hero text, large metrics                    |
| `display-md` | 22 / 30     | 700 (Bold)     | Section titles, audit work-hours number (prominent)    |
| `heading`    | 18 / 26     | 700            | Card titles, screen titles in app bar                  |
| `body-lg`    | 16 / 24     | 600 (SemiBold) | Primary body, button labels                            |
| `body`       | 15 / 22     | 400 (Regular)  | Default body text                                      |
| `body-sm`    | 13 / 20     | 400            | Captions, supporting text under display numbers        |
| `caption`    | 11 / 16     | 600            | Labels, badges, tiny meta text                         |
| `mono`       | 14 / 22     | 600            | Promo codes, referral codes (use system mono fallback) |

Numerals: Nunito's proportional numerals are fine. No tabular figures needed except for the referral code display (uses mono).

### 4.4 Spacing Scale

Based on a 4px base unit, mapped to Tailwind spacing tokens:

| Token | Pixels |
| ----- | ------ |
| `1`   | 4      |
| `2`   | 8      |
| `3`   | 12     |
| `4`   | 16     |
| `5`   | 20     |
| `6`   | 24     |
| `8`   | 32     |
| `10`  | 40     |
| `12`  | 48     |
| `16`  | 64     |
| `20`  | 80     |

Default screen horizontal padding: `5` (20px). Default vertical rhythm between content blocks: `6` (24px). Tight rhythm within cards: `3`–`4`.

### 4.5 Radii

| Token  | Pixels | Use                           |
| ------ | ------ | ----------------------------- |
| `sm`   | 8      | Chips, small buttons, inputs  |
| `md`   | 12     | Cards, default buttons        |
| `lg`   | 20     | Bottom sheets, large surfaces |
| `xl`   | 28     | Hero illustrations, pill CTAs |
| `full` | 9999   | Avatars, pill buttons, badges |

Nothing in the app should have hard 90° corners except the device frame.

### 4.6 Shadows / Elevation

Soft and minimal. Only three elevation levels:

| Token      | Definition                          | Use                                                       |
| ---------- | ----------------------------------- | --------------------------------------------------------- |
| `flat`     | none                                | Default — most surfaces                                   |
| `raised`   | `0 2px 8px rgba(44, 42, 38, 0.06)`  | Cards, list items, interactive surfaces                   |
| `floating` | `0 8px 24px rgba(44, 42, 38, 0.10)` | Bottom sheets, the price-input field on home when focused |

No drop shadows on icons or text. No glow effects.

### 4.7 Iconography

**Lucide React Native** for all icons. Default size 20. Default stroke width 1.75 (slightly softer than Lucide's default 2). Icons inherit `currentColor`.

Common icons used:

| Use                                | Icon                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Home tab                           | `Home`                                                                                                                      |
| Vault tab                          | `Snowflake`                                                                                                                 |
| Profile tab                        | `User`                                                                                                                      |
| Notifications                      | `Bell`                                                                                                                      |
| Back                               | `ChevronLeft`                                                                                                               |
| Close / dismiss sheet              | `X`                                                                                                                         |
| Currency selector chevron          | `ChevronDown`                                                                                                               |
| Premium lock                       | `Lock`                                                                                                                      |
| Premium feature unlocked / refresh | `RefreshCw`                                                                                                                 |
| Add hobby                          | `Plus`                                                                                                                      |
| Remove hobby                       | `X`                                                                                                                         |
| Copy code                          | `Copy`                                                                                                                      |
| Share                              | `Share2`                                                                                                                    |
| Info icon (onboarding tooltips)    | `Info`                                                                                                                      |
| Checkmark (success states)         | `Check`                                                                                                                     |
| Edit                               | `Pencil`                                                                                                                    |
| Logout                             | `LogOut`                                                                                                                    |
| Delete                             | `Trash2`                                                                                                                    |
| Notification toggle                | `BellOff` / `Bell`                                                                                                          |
| Decision: skip                     | `Snowflake` (consistent with vault) is reused for freeze; **for skip, no icon** — the swipe-to-unlock is its own affordance |
| Decision: buy                      | `ShoppingBag`                                                                                                               |
| Decision: freeze                   | `Snowflake`                                                                                                                 |
| Re-freeze (vault detail)           | `Clock`                                                                                                                     |

### 4.8 Component Strategy

**Use Gluestack UI v3 components as-is for:**

- `Button`, `ButtonText`, `ButtonIcon`
- `Input`, `InputField`, `InputIcon`
- `Text`, `Heading`
- `VStack`, `HStack`, `Box`, `Center`
- `Avatar`, `AvatarFallback`, `AvatarImage`
- `Pressable`
- `Actionsheet` (bottom sheets)
- `Modal` (only if absolutely needed; prefer Actionsheet)
- `Toast` (transient feedback)
- `Switch` (notification toggle, etc.)
- `Progress` (level progress bar)
- `Badge` (premium pill, level badge, "PRO" feature lock)
- `Spinner` (loading)
- `Divider`
- `FormControl`, `FormControlLabel`, `FormControlError`

**Custom components (built on top of Gluestack primitives):**

- `SwipeToConfirm` — the swipe-to-unlock skip control (no Gluestack equivalent)
- `PriceInput` — large price field with inline currency selector
- `HobbyChip` — selectable chip with checked state for the hobby grid
- `LevelBadge` — circular badge with level number and tier color
- `CountdownPill` — small pill showing time remaining on a frozen item
- `ConfettiBlast` — Lottie wrapper for celebration confetti
- `PremiumLockBadge` — small "PRO" badge overlay for locked features
- `IllustrationFrame` — sized container for hero illustrations
- `StepProgressBar` — segmented progress bar for onboarding

### 4.9 Theming Implementation

`tailwind.config.js` defines all color and spacing tokens. Gluestack UI v3 is configured to consume these same tokens via its theme provider so component variants inherit the brand palette automatically. Any color used in component code references the token, never a raw hex. Per-screen override styles use NativeWind classes with the same tokens.

---

## 5. Data Model

The base schema is defined in ADR-004. This section documents v1's full schema including the additions required for the referral/premium system, the levels system, notifications, and the predefined hobby and seed code tables.

### 5.1 Updated Entity List

| Table                 | Purpose                                         | Source                               |
| --------------------- | ----------------------------------------------- | ------------------------------------ |
| `user`                | Profile, wage, currency, premium status         | ADR-004 (modified — `role` replaced) |
| `user_hobby`          | User's hobby list (free-form text)              | ADR-004                              |
| `user_suggestion`     | Cached AI-generated alternatives per hobby      | ADR-004                              |
| `tracked_item`        | All decisions: skipped, bought, frozen          | ADR-004 (extended)                   |
| `currency_rate`       | Daily-synced USD-base exchange rates            | ADR-004                              |
| `predefined_hobby`    | Master list of selectable hobbies in onboarding | New                                  |
| `promo_code`          | Seed codes (e.g., `LAUNCH2026`)                 | New                                  |
| `referral_redemption` | Audit log of who redeemed which code            | New                                  |
| `notification`        | In-app notification feed entries                | New                                  |

### 5.2 `user` (Modified)

The ADR-004 `role` enum is removed. Premium status is now derived from `premium_expires_at`.

| Field                   | Type        | Default              | Notes                                                                |
| ----------------------- | ----------- | -------------------- | -------------------------------------------------------------------- |
| `id`                    | uuid PK     | —                    | Supabase Auth user ID                                                |
| `name`                  | text        | —                    | Display name                                                         |
| `avatar_seed`           | text        | (= id)               | DiceBear seed (defaults to user UUID)                                |
| `birthdate`             | date        | —                    | Onboarding                                                           |
| `country`               | text        | —                    | ISO 3166-1 alpha-2 code                                              |
| `display_currency`      | text        | derived from country | ISO 4217                                                             |
| `wage_currency`         | text        | derived from country | ISO 4217                                                             |
| `hourly_wage_usd`       | decimal     | —                    | Always stored in USD                                                 |
| `work_hours_per_day`    | decimal     | 8                    |                                                                      |
| `notifications_enabled` | boolean     | true                 | App-level switch                                                     |
| `premium_expires_at`    | timestamptz | null                 | NULL = free user                                                     |
| `referral_code`         | text UNIQUE | generated            | 6 chars, uppercase alphanumeric                                      |
| `decision_count`        | integer     | 0                    | Sum of skip + buy decisions (incremented on skip/buy, NOT on freeze) |
| `created_at`            | timestamptz | now()                |                                                                      |

**Computed/derived fields (not stored):**

- `is_premium` = `premium_expires_at IS NOT NULL AND premium_expires_at > now()`
- `total_saved_usd` = `SUM(price_usd) FROM tracked_item WHERE user_id = ? AND status = 'skipped'`
- `total_saved_30d_usd` = same with `decided_at > now() - interval '30 days'`
- `level` = derived from `decision_count` per Section 7
- `decisions_to_next_level` = derived

### 5.3 `tracked_item` (Extended)

Adds an `item_emoji` field and clarifies the lifecycle.

| Field                      | Type        | Default  | Notes                                                                                  |
| -------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------- |
| `id`                       | uuid PK     | —        |                                                                                        |
| `user_id`                  | uuid FK     | —        |                                                                                        |
| `name`                     | text        | null     | Only set when item is frozen (named at freeze time)                                    |
| `item_emoji`               | text        | null     | Optional, only set if user freezes; for v1, not auto-generated for skip/buy items      |
| `price_usd`                | decimal     | —        | Always stored in USD                                                                   |
| `price_currency`           | text        | —        | The currency the user originally entered the price in (for display in vault if needed) |
| `conversion_rate_snapshot` | decimal     | —        | USD → display_currency rate at decision time                                           |
| `status`                   | enum        | `frozen` | `frozen`, `bought`, `skipped`                                                          |
| `freeze_until`             | timestamptz | null     | Only set when status = frozen; this is when the timer expires                          |
| `frozen_at`                | timestamptz | null     | When the freeze was created (or last re-frozen)                                        |
| `created_at`               | timestamptz | now()    | When the audit was first opened                                                        |
| `decided_at`               | timestamptz | null     | When the user finally chose skip or buy                                                |

**Lifecycle states:**

1. **Active frozen:** `status = 'frozen' AND freeze_until > now()` — countdown ticking, shown in vault with countdown.
2. **Thawed (decision time):** `status = 'frozen' AND freeze_until <= now()` — timer hit zero, awaits final decision, shown in vault with "Decision time" badge.
3. **Skipped:** `status = 'skipped'` — counted in `total_saved_usd`, contributes to `decision_count`.
4. **Bought:** `status = 'bought'` — does not count toward savings, contributes to `decision_count`. Not displayed in v1.

**Re-freezing** (from vault detail): updates `freeze_until` and `frozen_at`. Replaces previous countdown — does not extend it.

### 5.4 `predefined_hobby` (New)

| Field         | Type        | Notes                                                                        |
| ------------- | ----------- | ---------------------------------------------------------------------------- |
| `id`          | uuid PK     |                                                                              |
| `name`        | text UNIQUE | English display name                                                         |
| `lucide_icon` | text        | Name of Lucide icon to render (e.g., `"Bike"`, `"Music"`, `"Camera"`)        |
| `category`    | text        | For grouping in the picker (e.g., `"Sports"`, `"Music"`, `"Food"`, `"Tech"`) |
| `sort_order`  | integer     | Manual ordering within category                                              |
| `is_active`   | boolean     | Soft delete flag                                                             |

Seeded with ~40 hobbies across ~6 categories. Examples: Cycling, Running, Hiking, Yoga (Sports); Guitar, Piano, Singing (Music); Cooking, Coffee, Wine (Food); Photography, Painting, Reading (Creative); Gaming, PC building, Coding (Tech); Travel, Camping, Gardening (Outdoors).

Free users select from this table only. Premium users may additionally enter custom hobbies (free text → `user_hobby` row directly).

### 5.5 `user_hobby` (Clarified)

Unchanged from ADR-004. One row per hobby per user. The `hobby_name` field stores either:

- A predefined hobby's `name` value (looked up at selection time), or
- A free-text custom hobby (premium only).

A `source` field is added to distinguish:

| Field                 | Type        | Notes                                                                  |
| --------------------- | ----------- | ---------------------------------------------------------------------- |
| `id`                  | uuid PK     |                                                                        |
| `user_id`             | uuid FK     |                                                                        |
| `hobby_name`          | text        |                                                                        |
| `source`              | enum        | `predefined`, `custom`                                                 |
| `predefined_hobby_id` | uuid FK     | NULL for custom                                                        |
| `is_moderated`        | boolean     | true for predefined; for custom, false until backend moderation passes |
| `created_at`          | timestamptz |                                                                        |

Suggestions are only generated for `is_moderated = true` hobbies. Custom hobbies awaiting moderation show a "Pending review" state in the profile/hobbies view (not visible elsewhere).

### 5.6 `user_suggestion` (Unchanged from ADR-004)

Adds `item_emoji` for clarity.

| Field          | Type        | Notes                              |
| -------------- | ----------- | ---------------------------------- |
| `id`           | uuid PK     |                                    |
| `hobby_id`     | uuid FK     | ON DELETE CASCADE                  |
| `name`         | text        | AI-generated alternative item name |
| `item_emoji`   | text        | AI-generated emoji for the item    |
| `price_usd`    | decimal     | Suggested price in USD             |
| `country`      | text        | Cache key (denormalized)           |
| `generated_at` | timestamptz |                                    |

When the user manually refreshes (premium only), all rows for that user's hobbies in this country are deleted and regenerated.

### 5.7 `currency_rate` (Unchanged from ADR-004)

| Field        | Type             | Notes                   |
| ------------ | ---------------- | ----------------------- |
| `id`         | uuid PK          |                         |
| `base`       | text             | Always `'USD'`          |
| `target`     | text             | ISO 4217                |
| `rate`       | decimal          | 1 USD = `rate` `target` |
| `fetched_at` | timestamptz      |                         |
| UNIQUE       | `(base, target)` |                         |

### 5.8 `promo_code` (New)

For seed codes only. User referral codes live on the `user.referral_code` field, not here.

| Field                    | Type        | Notes                                     |
| ------------------------ | ----------- | ----------------------------------------- |
| `id`                     | uuid PK     |                                           |
| `code`                   | text UNIQUE | E.g., `LAUNCH2026`                        |
| `premium_months_granted` | integer     | Default 3                                 |
| `max_uses`               | integer     | NULL = unlimited                          |
| `current_uses`           | integer     | Default 0, incremented on each redemption |
| `is_active`              | boolean     | Default true                              |
| `created_at`             | timestamptz |                                           |

### 5.9 `referral_redemption` (New)

Audit log of every redemption. Used to enforce the "one redemption per user, ever" rule and to award the referrer.

| Field                    | Type        | Notes                                                            |
| ------------------------ | ----------- | ---------------------------------------------------------------- |
| `id`                     | uuid PK     |                                                                  |
| `redeemer_user_id`       | uuid FK     | The user who entered the code                                    |
| `code_used`              | text        | Either a `user.referral_code` value or a `promo_code.code` value |
| `referrer_user_id`       | uuid FK     | NULL if `code_used` was a seed code                              |
| `code_type`              | enum        | `user_referral`, `seed`                                          |
| `premium_months_granted` | integer     | 3 for v1                                                         |
| `redeemed_at`            | timestamptz | now()                                                            |

**Constraint:** UNIQUE on `redeemer_user_id` — enforces one redemption per user ever.

### 5.10 `notification` (New)

In-app notification feed. Synced across devices via Supabase. Push notifications are sent via `expo-notifications` separately but produce a corresponding row here for the in-app feed.

| Field             | Type        | Notes                                                               |
| ----------------- | ----------- | ------------------------------------------------------------------- |
| `id`              | uuid PK     |                                                                     |
| `user_id`         | uuid FK     |                                                                     |
| `type`            | enum        | `freeze_thawed` (only type in v1)                                   |
| `tracked_item_id` | uuid FK     | The item whose timer expired                                        |
| `created_at`      | timestamptz | When the timer expired                                              |
| `read_at`         | timestamptz | NULL until user opens it; set when they tap it (synced to Supabase) |

When read, notifications are filtered out of the panel by default. There is no "Mark all read" in v1; only individual tap-through marks read.

### 5.11 Edge Functions

| Function                | Trigger                                                                                               | Purpose                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generate-suggestions`  | Called from app when audit page loads and no fresh suggestions exist for the user's hobbies + country | Calls AI provider, stores rows in `user_suggestion`                                                                                                                                                      |
| `sync-currency-rates`   | `pg_cron`, daily at 04:00 UTC                                                                         | Fetches USD-base rates from a free API (e.g., exchangerate.host), upserts into `currency_rate`                                                                                                           |
| `moderate-custom-hobby` | Called from app when premium user adds a custom hobby                                                 | Async moderation; sets `is_moderated = true` if it passes                                                                                                                                                |
| `redeem-code`           | Called when user submits a code                                                                       | Validates code (exists, not self, not previously redeemed by this user, has uses left for seed codes), grants 3 months to redeemer (and to referrer if user-referral), inserts `referral_redemption` row |
| `process-thawed-items`  | `pg_cron`, every 5 minutes                                                                            | Finds tracked_items where `status = 'frozen' AND freeze_until <= now()` AND no notification row exists yet; creates `notification` row + sends push if user opted in                                     |

### 5.12 Row Level Security

All user-data tables (`user_hobby`, `user_suggestion`, `tracked_item`, `notification`, `referral_redemption`) have RLS policies restricting access to `auth.uid() = user_id` (or `redeemer_user_id` for redemption — exception: the referrer also needs to see their own referral count derived from rows where `referrer_user_id = auth.uid()`, but this is read-only).

`predefined_hobby`, `promo_code`, `currency_rate` are world-readable (no PII).

---

## 6. Premium & Referral System

### 6.1 What Premium Unlocks

In v1, premium unlocks exactly **three features**:

1. **Refresh alternatives** on the audit page (free users see the refresh button with a `PRO` lock badge; tap shows upsell sheet).
2. **Custom freeze duration** in the freeze bottom sheet (free users see only the 4 predefined chips: 30 min / 6 hr / 1 day / 1 week; the "Custom" option shows a `PRO` lock badge).
3. **Custom hobbies** in the hobbies sub-screen (free users see only "Add from list"; the "Add custom" option shows a `PRO` lock badge).

Onboarding never exposes the custom-hobby option, regardless of premium status (kept clean).

### 6.2 How Premium Is Granted

Premium is granted **only** by redeeming a code:

- A **seed code** (e.g., `LAUNCH2026`) — distributed by the team.
- A **user referral code** — auto-generated for every user at signup (6-character uppercase alphanumeric, e.g., `K7M2QP`).

**No payment flow exists in v1.** No "Buy Premium" button, no Apple Pay / Google Pay integration, no Stripe — nothing.

### 6.3 Reward Mechanics

- Successful redemption grants the **redeemer** 3 months of premium.
- If the code redeemed was a **user referral code**, the **referrer** also receives 3 months of premium added to their account.
- If the referrer is currently a free user, redeeming a referral via them makes them premium for 3 months.
- Months **stack**: if a user has 47 days of premium remaining and another referral comes in, they now have 47 + 90 days.
- Referral codes are **unlimited use outbound** — a user can refer as many people as they want.
- Redemption is **one-time inbound** — every user can redeem exactly one code, ever.
- Users **cannot redeem their own code**.

### 6.4 Premium Expiry

When `premium_expires_at <= now()`, the user instantly reverts to free status:

- All locked features re-show their `PRO` lock badge.
- Tapping a locked feature shows the upsell sheet.
- **Existing premium-created data is preserved.** Custom hobbies remain in the user's hobby list and continue to inform suggestions. Existing custom-frozen items keep their countdown to completion. The user just can't _create_ new premium-only artifacts until they redeem again.
- No grace period. No reminder before expiry in v1. No expiry banner. The only signal is the premium pill in the profile changing from "Premium · 47 days left" to "Free · Get Premium →".

### 6.5 Promo Code Entry Points

There are two entry points for entering a code:

1. **During onboarding (optional).** On the hobbies step, a small text link "I have a promo code" appears below the main content. Tapping it advances to a dedicated `/onboarding/promo` step _after_ the hobbies step (i.e., user picks hobbies first, then enters code, then completes onboarding). The standard onboarding "Continue" button does not change its label or position when the link is present — the link is independent. If the user does _not_ tap the link, the promo step is skipped.

2. **From profile, anytime.** A "Redeem code" row in the profile settings opens the same redemption bottom sheet (used after onboarding too, e.g., when premium expires).

Both entry points use the same redemption sheet and the same backend function.

### 6.6 Redemption Sheet Behavior

- Single text input, monospace font, auto-uppercase, auto-trim.
- Submit button (Gluestack `Button`, primary) disabled until input is non-empty.
- On submit, calls `redeem-code` Edge Function.
- Possible error states (inline below input, semantic danger color):
  - "Code not recognized."
  - "This code has already reached its maximum uses." (seed codes)
  - "You can't redeem your own code."
  - "You've already redeemed a code on this account."
- On success, the sheet closes and the **redemption celebration sheet** opens immediately (see Section 10.16).

### 6.7 Sharing the Referral Code

In the profile, a "Your code" block shows:

- The user's 6-character code in a large monospace font (e.g., `K7M2QP`).
- A `Copy` button (Lucide `Copy` icon, primary tinted) that copies to clipboard and shows a Gluestack `Toast` "Code copied".
- Below: caption text "Share your code. You and your friend each get 3 months of Premium."

No native share sheet integration in v1 (just copy-to-clipboard, per requirement). No deep links yet (e.g., `badbuy://redeem/K7M2QP`).

---

## 7. Gamification — Levels & Decisions

### 7.1 The Counter

The user has a single integer counter: `decision_count`. It is incremented by **+1** on every:

- Skip decision (when the user completes the swipe-to-unlock).
- Buy decision (when the user taps Buy on the audit or vault detail page).

**Freeze is not counted.** Freeze is treated as a deferred decision — only the eventual skip or buy after thawing counts.

Re-freezing an already-frozen item is also not counted.

### 7.2 Levels

There are 20 levels grouped into 4 tiers. The thresholds (cumulative decisions required to _reach_ each level):

| Level | Decisions | Tier        |
| ----- | --------- | ----------- |
| L1    | 0         | Aware       |
| L2    | 3         | Aware       |
| L3    | 8         | Aware       |
| L4    | 15        | Aware       |
| L5    | 25        | Aware       |
| L6    | 40        | Mindful     |
| L7    | 60        | Mindful     |
| L8    | 85        | Mindful     |
| L9    | 115       | Mindful     |
| L10   | 150       | Mindful     |
| L11   | 190       | Intentional |
| L12   | 230       | Intentional |
| L13   | 275       | Intentional |
| L14   | 320       | Intentional |
| L15   | 370       | Intentional |
| L16   | 420       | Zen         |
| L17   | 470       | Zen         |
| L18   | 520       | Zen         |
| L19   | 570       | Zen         |
| L20   | 600       | Zen (max)   |

After L20, decisions still increment `decision_count` (visible in settings/internal data, not displayed prominently), but no further leveling occurs. The progress bar at L20 reads "Max level reached."

### 7.3 Tier Names & Captions

| Tier        | Caption shown under level number |
| ----------- | -------------------------------- |
| Aware       | "Noticing the urge"              |
| Mindful     | "Pausing before buying"          |
| Intentional | "Spending with purpose"          |
| Zen         | "At peace with money"            |

### 7.4 Tier Visuals

Each tier has a distinct **badge color** for the level badge displayed in profile and on skip/buy pages when a level-up occurs:

| Tier        | Badge color               |
| ----------- | ------------------------- |
| Aware       | `primary-300` (soft sage) |
| Mindful     | `primary-500` (full sage) |
| Intentional | `accent-500` (coral)      |
| Zen         | `celebrate-yellow` (gold) |

The badge itself is a circular shape (Gluestack `Avatar` styled, or custom `LevelBadge` component) with the level number centered in `display-md` weight and the tier color as the fill, with white text inverse.

### 7.5 Progress Bar Logic

The profile shows a progress bar from "current level threshold" → "next level threshold." Examples:

- A user at L3 with 12 decisions (L3=8, L4=15) shows a bar `(12-8) / (15-8) = 57%` filled, with caption "3 more to L4".
- A user at L10 with 150 decisions shows a bar `0%` filled with caption "40 more to L11".
- A user at L20 shows a full bar with caption "Max level reached".

### 7.6 Level-Up Detection

A level-up occurs when, after incrementing `decision_count`, the new value crosses a threshold. The decision page (skip or buy) is responsible for detecting this and rendering the appropriate level-up message inline.

If multiple thresholds are crossed in a single decision (impossible at +1 per decision, but defensive), only the new highest level is shown.

### 7.7 Level-Up Display on Skip/Buy Pages

When no level-up occurs, the skip/buy page shows a simple inline line: "Decision +1" (caption style, `text-secondary`).

When a level-up occurs, that line is replaced by a slightly bolder, highlighted card-like inline element:

- Small `LevelBadge` (level number, new tier color)
- "Level up! You're now L<n> — <Tier name>"
- Tier caption ("Spending with purpose")

No animation in v1 beyond the existing Lottie confetti on skip page (which already plays). Buy-page level-ups are calm — no confetti, just the inline card.

---

## 8. Currency, Conversion & Work-Hours Logic

### 8.1 Storage Principle

All monetary values in the database are stored in USD with a `_usd` suffix on the column name. Display in any other currency is computed at the application layer using the `currency_rate` table.

### 8.2 Default Currency Mapping (Country → Currency)

A static lookup table maintained in the app (and synced if needed). Examples:

| Country   | Default Display Currency | Default Wage Currency |
| --------- | ------------------------ | --------------------- |
| US        | USD                      | USD                   |
| Czechia   | CZK                      | CZK                   |
| France    | EUR                      | EUR                   |
| Germany   | EUR                      | EUR                   |
| UK        | GBP                      | GBP                   |
| Japan     | JPY                      | JPY                   |
| (unknown) | USD                      | USD                   |

The user can override either currency independently in onboarding or settings (e.g., wage in CZK while displaying prices in EUR).

### 8.3 Supported Currencies

All currencies returned by the chosen free exchange-rate API (e.g., exchangerate.host returns ~150+). No manual curation. The currency picker shows the full list, alphabetically by ISO code with the full name, with the user's display currency pinned at the top and recently-used (last 3 distinct) below it.

### 8.4 Work-Hours Calculation

```
hours = price_usd / hourly_wage_usd
```

The user's `hourly_wage_usd` is derived at onboarding from `(wage_input × wage_currency_to_usd_rate)`. If the user later changes their wage in profile settings, the same conversion is re-run using the current rate at that moment, and `hourly_wage_usd` is updated.

The audit page displays the result rounded to 1 decimal place (e.g., "4.5 hours"). For values below 1 hour, the page displays in minutes ("27 minutes"). For values above 8 hours, the page also shows the workday equivalent in the secondary caption (see Section 8.5).

### 8.5 Work-Hours Caption Logic

The prominent number is the work-hours figure. The smaller secondary caption beneath it provides a richer interpretation, scaled to the user's `work_hours_per_day`:

| Work hours                  | Caption                               |
| --------------------------- | ------------------------------------- |
| < 0.5 h (= < 30 min)        | "Less than half an hour of work"      |
| 0.5 – 1.0 h                 | "Around half an hour of work"         |
| 1.0 – 2.0 h                 | "About an hour of work"               |
| 2.0 h – 0.5 × workday       | "A small chunk of your workday"       |
| 0.5 × workday – 1 × workday | "More than half your workday"         |
| 1 × workday – 3 × workday   | "About <N> workdays" (rounded to 0.5) |
| > 3 × workday               | "Over <N> workdays" (rounded down)    |

These captions are written to feel calm and informative, not alarmist.

### 8.6 Display Conversion

When showing a price to the user (vault list, audit page header, total saved, etc.):

```
display_amount = price_usd × rate_usd_to_display_currency
```

For tracked items already decided, `conversion_rate_snapshot` is used instead, so the displayed amount never drifts as exchange rates change.

For freshly entered prices on the home page, the user is entering directly in their display currency, so no conversion happens until storage (where it's converted _to_ USD using the current rate).

### 8.7 Rate Sync

Daily at 04:00 UTC via `pg_cron` calling the `sync-currency-rates` Edge Function. If the sync fails, rates remain at the last successful sync's values (acceptable per ADR-004 R1).

---

## 9. Notifications

### 9.1 Notification Types in v1

Only **one type**: `freeze_thawed` — a frozen item's countdown has reached zero.

### 9.2 Push Notifications

- Implemented via `expo-notifications`.
- Sent only if the user has `notifications_enabled = true` AND has granted OS-level push permission.
- Triggered by the `process-thawed-items` cron (every 5 minutes).
- Generic copy in v1: title `"Decision time"`, body `"A frozen item is ready for your decision."` (No item-specific copy in v1 — the item details are inside the app.)
- Tapping the push notification opens the app and routes to `/vault/[id]` (the audit view for that specific item). If the app was cold-started, the route is the deep link target.

### 9.3 In-App Notification Feed

Lives in a bottom sheet opened by tapping the bell icon (top right of Shell B).

**Sheet contents (when notifications exist):**

- Title: "Notifications"
- List of unread notification rows, newest first
- Each row: item emoji (or default snowflake icon), item name (or "Unnamed item" fallback), price in display currency, "Ready for a decision" subtitle, relative timestamp ("2h ago")
- Tapping a row: closes the sheet, navigates to `/vault/[id]`, and marks the row as `read_at = now()` (synced to Supabase). Read rows are filtered out of subsequent panel views.

**Sheet contents (when no unread notifications):**

- Title: "Notifications"
- Centered text: "You're all caught up." in `text-secondary`
- No illustration.

### 9.4 Notification Independence Rules

- Notifications are independent of the in-app vault. The vault always shows all frozen items (active + thawed), regardless of notification read state.
- The bell icon's red dot badge appears whenever at least one unread notification exists.
- If the user opens a thawed item directly from the vault list (not via notification), the corresponding notification row is _also_ marked as read at that moment (the user has handled it).

### 9.5 What Happens When the User Doesn't Have Push Enabled

- `expo-notifications` is not invoked for that user.
- The `notification` row is still created by the cron when an item thaws.
- The bell icon shows the dot badge.
- The user discovers thawed items via the in-app notification panel or the vault list itself.

---

## 10. Screen Specifications

This section is the bulk of the document. Every screen, sheet, and overlay in v1 is specified with: purpose, layout, components, states, copy, and interactions.

Screens are documented in the order a new user would encounter them.

### 10.1 Landing Page

**Route:** `/landing` (Shell A — no chrome)

**Purpose:** First impression for unauthenticated users. Convert to register (primary) or login (secondary). 70/30 weighting toward register.

**Layout (top to bottom):**

1. Top spacing (status bar safe area + ~32px).
2. **Hero illustration** — large, centered, ~50% of screen height. Soft, calm, illustrative. Subject: a person breathing or pausing thoughtfully, with abstract floating shapes representing money/items around them. Warm palette matching brand. (See Section 13 for the generation prompt.)
3. **Headline** (`display-lg`, centered, max 2 lines): "Pause before you buy."
4. **Subheadline** (`body-lg`, `text-secondary`, centered, max 2 lines): "See the true cost of what you spend. Skip what doesn't matter."
5. Spacer.
6. **Primary CTA**: Gluestack `Button` (size lg, full width minus screen padding), label "Create account", routes to `/register`.
7. Vertical spacing `3` (12px).
8. **Secondary CTA**: Gluestack `Button` variant `link` or `outline`, label "I already have an account", routes to `/login`. Smaller visual weight.
9. Bottom safe-area spacing.

**Empty / loading / error states:** None — this is a static screen.

### 10.2 Login

**Route:** `/login` (Shell A — no chrome)

**Purpose:** Authenticate returning user via email + password.

**Layout (top to bottom):**

1. Status bar safe area.
2. Top bar: just a `ChevronLeft` back button at left, no title. Tapping → back to landing.
3. Vertical padding (`8`).
4. **Title** (`display-md`): "Welcome back".
5. Vertical spacing (`6`).
6. **Form** (Gluestack `FormControl` per field, stacked):
   - Email — Gluestack `Input` with `InputField` (keyboardType `email-address`, autocapitalize off, autocomplete `email`).
   - Password — Gluestack `Input` with secure entry toggle (eye icon).
7. Inline error space below form (Gluestack `FormControlError`, semantic danger color).
8. Vertical spacing (`6`).
9. **Primary CTA**: Gluestack `Button` (full width), label "Log in".
10. Vertical spacing (`4`).
11. Centered text link (`body`): "Don't have an account? **Sign up**" — "Sign up" is the link to `/register`.

**States:**

- Loading: button shows Gluestack `Spinner` inline, button disabled.
- Error: inline below form. Generic message: "Email or password is incorrect."
- Forgot password: **out of scope for v1** — no link shown.

### 10.3 Register

**Route:** `/register` (Shell A — no chrome)

**Purpose:** Create a new account. Email + password + repeated password.

**Layout (top to bottom):**

1. Status bar safe area.
2. Top bar: `ChevronLeft` back to landing.
3. Vertical padding (`8`).
4. **Title** (`display-md`): "Create your account".
5. Vertical spacing (`6`).
6. **Form** (stacked):
   - Email
   - Password (with eye toggle, helper text below: "At least 8 characters")
   - Repeat password (with eye toggle)
7. Inline error space.
8. Vertical spacing (`6`).
9. **Primary CTA**: "Create account" (full width).
10. Vertical spacing (`4`).
11. Centered link: "Already have an account? **Log in**" → `/login`.

**Validation:**

- Email format (RFC standard).
- Password ≥ 8 characters.
- Passwords match.
- All errors shown inline per field after first blur or submit attempt.

**States:**

- Loading: button shows spinner.
- Error from Supabase (e.g., email already exists): inline below the email field — "An account with this email already exists."
- Success: route to `/onboarding/identity` (no email verification in v1).

### 10.4 Onboarding — Step 1: Identity

**Route:** `/onboarding/identity` (Shell A, with onboarding header)

**Purpose:** Collect name, birthdate, country.

**Onboarding shell (used for all onboarding steps):**

- Status bar safe area.
- Top header: thin `StepProgressBar` showing current step / total steps. The total is computed dynamically (3 if no promo, 4 if promo branch is active — but the user doesn't know about the promo step until step 3, so the bar shows 3 segments by default and updates to 4 if they tap "I have a code"). On step 1, the first segment is filled, others outlined.
- No back button on step 1. Steps 2, 3, 4 have a back arrow on the left of the progress bar.
- Bottom: persistent **"Continue"** button (Gluestack `Button`, primary, full width minus padding). Disabled until form is valid.
- Body content scrollable, with bottom button overlaid (sticky) above the safe area.

**Body layout:**

1. Vertical padding (`8`).
2. **Step title** (`display-md`): "Tell us about you".
3. **Step subtitle** (`body`, `text-secondary`): "We'll personalize your experience."
4. Vertical spacing (`8`).
5. **Form fields** (stacked, each with label and optional info icon):
   - **Name** — Gluestack `Input`. Label: "Your name". Placeholder: "How should we call you?"
   - **Birthdate** — Tappable field that opens native date picker. Label: "Birthdate". Placeholder: "Select date". Info icon `i` on the label opens an inline tooltip / sheet: "We use this only to greet you and personalize content. We never share it."
   - **Country** — Tappable field that opens the **Country bottom sheet**. Label: "Country". Placeholder: "Select your country". Info icon: "Helps us suggest alternatives that are actually available where you live."
6. Bottom padding to clear the sticky button.

**Country bottom sheet:**

- Gluestack `Actionsheet`.
- Title: "Select country".
- Search input at top (Gluestack `Input` with `Search` icon).
- Scrollable list of all UN countries (193), alphabetical, each row: flag emoji + country name.
- Tap → selects, closes sheet, populates the country field, and pre-fills the display currency and wage currency on step 2 (overridable).

**Validation:** All three fields required. Continue disabled until all filled.

### 10.5 Onboarding — Step 2: Money

**Route:** `/onboarding/money` (Shell A, with onboarding header)

**Purpose:** Collect display currency, wage amount + currency, work hours per day.

**Body layout:**

1. **Step title** (`display-md`): "Your money basics".
2. **Step subtitle** (`body`, `text-secondary`): "We'll never share this. It powers your work-hour calculations."
3. Vertical spacing (`8`).
4. **Form fields:**
   - **Display currency** — Tappable field, opens **Currency bottom sheet**. Label: "Show prices in". Default value: derived from country (step 1). Info icon: "The currency you'll see prices in throughout the app."
   - **Hourly wage** — Compound row: numeric `Input` on the left, currency selector chip on the right (tap → opens Currency bottom sheet for wage currency separately). Default wage currency = display currency. Label above: "Your hourly wage". Info icon: "We use this to convert prices into hours of work. We never share it."
   - **Work hours per day** — Numeric `Input` with stepper (Gluestack increment/decrement buttons) or simple input. Default: 8. Label: "Average work hours per day". Min 1, max 16. Info icon: "Helps us put prices in the context of your workday."
5. Sticky "Continue" button at bottom.

**Currency bottom sheet:**

- Title: "Select currency".
- Search input at top.
- Scrollable list of all currencies returned by the rate API, alphabetical by ISO code, each row: ISO code (mono) + full name + symbol.
- Pinned at top: user's display currency (after first set), then last 3 distinct currencies used recently.
- Tap → selects, closes sheet.

**Validation:** All fields required. Wage > 0. Work hours 1–16. Continue disabled until valid.

### 10.6 Onboarding — Step 3: Hobbies

**Route:** `/onboarding/hobbies` (Shell A, with onboarding header)

**Purpose:** Select 3+ hobbies that will personalize the alternative-purchase suggestions on every audit.

**Body layout:**

1. **Step title** (`display-md`): "What are you into?".
2. **Step subtitle** (`body`, `text-secondary`): "Pick at least 3. We'll use these to suggest alternatives — like 'this jacket = 4 climbing-gym sessions'."
3. Vertical spacing (`6`).
4. **Selected hobbies counter** (small, `caption`, right-aligned): "3 / minimum 3 selected" — turns green/primary when ≥ 3.
5. Vertical spacing (`4`).
6. **Hobby grid:** chips arranged in a flowing wrap layout (NativeWind `flex flex-wrap gap-2`). Each chip is a `HobbyChip` component:
   - Default state: pill with rounded `lg` radius, `surface` background, `border` outline, hobby name text + Lucide icon.
   - Selected state: filled `primary-500` background, `text-inverse` text, no border, slightly raised shadow.
   - Tap toggles selection.
7. Chips grouped under category subheadings (`heading` size, `text-primary`, with vertical spacing above each group). Categories: Sports, Music, Food, Creative, Tech, Outdoors, Other.
8. **Bottom-of-content area:**
   - A small text link (`body`, primary color underline): "I have a promo code". Tapping it does **not** insert the promo input here. Instead, it sets a local flag and adds the `/onboarding/promo` step to the flow. The progress bar updates from 3 segments to 4. A subtle confirmation Toast appears: "We'll ask for your code in the next step."
9. Sticky "Continue" button.

**Hobby data source:** `predefined_hobby` table. Free users see only predefined hobbies — no custom hobby option in onboarding regardless of premium status.

**Validation:** At least 3 hobbies selected. Continue disabled until then.

### 10.7 Onboarding — Step 4: Promo Code (Conditional)

**Route:** `/onboarding/promo` (Shell A, with onboarding header) — only shown if user tapped "I have a promo code" on step 3.

**Body layout:**

1. **Step title** (`display-md`): "Got a code?".
2. **Step subtitle** (`body`, `text-secondary`): "Enter your promo or referral code to unlock 3 months of Premium."
3. Vertical spacing (`8`).
4. **Single text input**: monospace font, auto-uppercase, auto-trim, max 16 chars. Placeholder: "ENTER CODE". Centered text alignment for the input field.
5. Inline error space below input (semantic danger color):
   - "Code not recognized."
   - "This code has reached its maximum uses."
   - "You can't redeem your own code." (impossible at signup but kept for consistency)
6. Vertical spacing (`6`).
7. Caption (`body-sm`, `text-secondary`, centered): "Premium unlocks unlimited custom hobbies, custom freeze times, and the suggestion refresh."
8. Sticky bottom area:
   - Primary "Continue" button (label unchanged from other onboarding steps). Calls the redemption Edge Function. On success, advances to home with the success celebration sheet auto-opening on home load. On failure, shows inline error and stays on the screen.
   - Below Continue, a smaller text link "Skip for now" — advances directly to home without redeeming. (This is the only onboarding step with a skip option.)

**Validation:** Continue is enabled if input is non-empty. Skip is always enabled.

**Note on completing onboarding:** When the user finishes the final step (step 3 if no promo, step 4 if promo branch), the user record is updated with all collected data, the `referral_code` is generated server-side, and the user is routed to `/home`. From this point, the user is "in the app" and Shell B applies.

### 10.8 Home

**Route:** `/home` (Shell B)

**Purpose:** Frictionless price input. Get to the audit page in as few taps as possible.

**Layout (top to bottom):**

1. Top app bar (Shell B) — left side empty, right side notification bell. No title (the greeting acts as the title).
2. **Greeting block** (padded `5` horizontal, vertical `6`):
   - **Time-aware greeting** (`display-md`): "Good morning, Vojta", "Good afternoon, Vojta", "Good evening, Vojta", or "Hey Vojta" late at night.
   - Below, in `body`, `text-secondary`: "What are you thinking about?"
3. Vertical spacing (`8`).
4. **Saved-amount block** (a single soft `surface-alt` rounded card, padded inside, full width minus screen padding):
   - Caption (`caption`, `text-secondary`, uppercase): "SAVED IN LAST 30 DAYS"
   - Amount (`display-lg`, `text-primary`): formatted in user's display currency (e.g., "€312.50")
   - If no skipped items in last 30 days: amount shows "—" with caption "Nothing yet — your first skip will land here."
5. Vertical spacing (`8`).
6. **Price input block:**
   - **Custom `PriceInput` component** — large, full width, vertically tall (~80px). Visually a single field with two parts:
     - Left: large numeric value (`display-xl` weight). Empty placeholder shows the user's currency symbol greyed out (e.g., "€").
     - Right: currency selector chip — small rounded pill showing the current currency code (e.g., "EUR") with a `ChevronDown` icon. Tappable.
   - Tapping the numeric area focuses the field and brings up the native numeric keyboard.
   - **Auto-focus rule:** the field is auto-focused on every visit _except_ the first time the user lands on home post-onboarding (so they can read the greeting). Tracked via a per-session flag.
7. Vertical spacing (`6`).
8. **Primary CTA** ("See the cost") — Gluestack `Button` primary, full width minus padding, label "See the cost". Disabled until price > 0. Tap → routes to `/audit?price=<value>&currency=<code>`.

**Currency selector behavior:**

- Tapping the currency chip opens the **Currency bottom sheet** (same as onboarding). Default selection is the user's display currency. After selection, the chip updates and the input remains focused.

**Numeric input behavior:**

- Native numeric keyboard. Decimal point allowed. Max 2 decimal places enforced on blur.
- The keyboard, once up, is allowed to cover the saved-amount block — that's fine. The input field and CTA remain visible.
- No scrolling once the input is focused (per requirement). Layout is intentionally short enough that everything fits above the keyboard on common Android screen sizes.

**Notification bell:** Tapping opens the **Notifications bottom sheet** (Section 10.13). If unread notifications exist, a small dot badge in `accent-500` appears on the bell.

### 10.9 Audit

**Route:** `/audit?price=<value>&currency=<code>` (Shell B) and `/vault/[id]` (re-uses this UI)

**Purpose:** Show the user the _true cost_ of the price they entered, plus 5 alternatives. Let them decide skip / buy / freeze.

**Layout (top to bottom):**

1. Top app bar (Shell B): back button (allowed — see Section 3.7), title "Audit", notification bell on the right.

2. **Price block** (top, padded):
   - Caption (`caption`, `text-secondary`, uppercase): "PRICE"
   - Amount (`display-lg`, `text-primary`): formatted in display currency, e.g., "€89.00"

3. Vertical spacing (`6`).

4. **Work-hours block** (the prominent feature):
   - Container: a `surface-alt` rounded card, centered content, generous internal padding.
   - **Number** (`display-xl`, `text-primary` or `primary-700` for emphasis): "4.5 hours" (or "27 minutes" for sub-hour values).
   - Below, **caption** (`body`, `text-secondary`, centered): the contextual label per Section 8.5 — "More than half your workday."

5. Vertical spacing (`8`).

6. **Alternatives section header** (horizontal row, padded):
   - Left: heading (`heading`): "What else this could buy"
   - Right: `RefreshCw` icon button (Gluestack `Button` variant `link` with icon-only). For free users, the button has a small `PRO` badge overlay (`PremiumLockBadge` component). Tapping (free): opens the **Premium upsell sheet**. Tapping (premium): refetches suggestions, the button shows a brief spinner state during the fetch.

7. **Alternatives list** (vertical stack of 5 rows):
   - Each row: emoji (left, ~32px), name (`body-lg`, primary), price (`body`, `text-secondary`, right-aligned). One row per suggestion. Rows separated by a thin `border` divider.
   - The 5 suggestions are pulled from `user_suggestion`. If fewer than 5 exist for the user's hobbies, the system shows what it has plus a placeholder: "More coming soon."
   - **AI failure state:** if the suggestions call fails entirely, this section shows centered text in `text-secondary` ("Couldn't load suggestions") + a small primary "Try again" button. The work-hours block above remains intact.
   - **Loading state:** while suggestions are being generated for the first time, this section shows a centered spinner with caption "Brewing some ideas…".

8. Vertical spacing (`8`).

9. **Decision block** (sticky at bottom of screen, with `floating` shadow above to hint at separation):
   - Two side-by-side secondary buttons (Gluestack `Button` variant `outline`, equal width):
     - **Buy** — `ShoppingBag` icon left, "Buy" label.
     - **Freeze** — `Snowflake` icon left, "Freeze" label.
   - Below them, vertical spacing (`3`):
     - **Swipe-to-skip control** (`SwipeToConfirm` custom component): a wide rounded `lg` track (`primary-100` background) with a draggable handle at the left edge. Inside the track, centered text: "Swipe to skip →". The handle is a circular `primary-500` filled disc with a `Check` icon. Dragging right slides the handle along the track. At 25/50/75% positions, light haptic ticks fire. At 100% (handle reaches the right edge), success haptic fires + the track flashes briefly + navigates to `/skip`.
   - All three controls fit within a single decision block at the bottom of the screen, above the safe area.

**Vault detail variation (`/vault/[id]`):**

- Title in app bar: "Frozen item" (or the item's name if it has one).
- Below the price block, an extra row showing: countdown remaining (if active) or "Decision time" badge (if thawed).
- The Freeze button label changes to "Re-freeze" (Lucide `Clock` icon instead of `Snowflake`). Tapping opens the Freeze bottom sheet pre-populated with no duration (user picks anew).
- If the item is currently active (still frozen), all three actions remain available: Buy, Re-freeze, Skip.
- If the item is thawed, all three actions remain available too (user can decide to skip, buy, or re-freeze).
- On any decision, the existing `tracked_item` row is updated (status set, decided_at set) — no new row is created.

**Re-audit / changing price:**

- The user cannot edit the price on the audit page (per requirement). To change the price, they navigate back to home.

### 10.10 Skip Page

**Route:** `/skip` (full-screen, no shell, no back navigation)

**Purpose:** Celebrate the skip decision. The single joyful, bold moment in the app.

**Layout (top to bottom, all centered):**

1. Status bar safe area. Background: `bg` (warm off-white). Confetti animation (Lottie) overlays the entire screen, starting on mount, plays once over ~2.5 seconds. Confetti uses the celebration palette colors (yellow / pink / teal).
2. Vertical padding (~`12`).
3. **Skip illustration** — large, centered, ~35% of screen height. Soft, warm, joyful. Subject: a person in a calm victorious pose (e.g., arms gently raised, eyes closed, smile), or an abstract scene like a blooming flower / a balloon being released. (See Section 13 for the generation prompt.)
4. Vertical spacing (`6`).
5. **Saved amount** (`display-xl`, `celebrate-teal` color, centered): "+€89.00". The "+" prefix is part of the value.
6. **Caption** (`body`, `text-secondary`, centered): "saved on this one"
7. Vertical spacing (`6`).
8. **Decision indicator** — one of two states:
   - **No level-up:** simple line, `body-sm`, `text-secondary`, centered: "Decision +1"
   - **Level-up:** small inline card (`surface-alt` background, rounded `md`, padded `4`):
     - `LevelBadge` (small) on the left
     - "Level up! You're now L<n> — <Tier name>" (`body-lg`)
     - Tier caption ("Spending with purpose") below in `caption`, `text-secondary`
9. Vertical spacing (`6`).
10. **Secondary stat** (`body`, `text-secondary`, centered): "€401.50 saved in the last 30 days"
11. Spacer (flex).
12. **Continue CTA** (Gluestack `Button` primary, full width minus padding, label "Continue") — routes to `/home`. No back button anywhere on this screen.

### 10.11 Buy Page

**Route:** `/buy` (full-screen, no shell, no back navigation)

**Purpose:** Calm, warm send-off for the buy decision. Affirms that an informed buy is a good buy.

**Layout (top to bottom, all centered):**

1. Status bar safe area. Background: `bg`. **No confetti.**
2. Vertical padding (~`12`).
3. **Buy illustration** — large, centered, ~35% of screen height. Soft, warm, content. Subject: a wrapped gift, a hand holding something carefully, or an abstract "settled" scene. Distinct from the skip illustration but in the same warm palette. (See Section 13.)
4. Vertical spacing (`6`).
5. **Headline** (`display-md`, centered, max 2 lines): "Enjoy it."
6. **Caption** (`body`, `text-secondary`, centered): "You made an informed choice."
7. Vertical spacing (`6`).
8. **Decision indicator** — one of two states (same logic as skip page):
   - **No level-up:** "Decision +1"
   - **Level-up:** the same inline card as on the skip page (calm, no confetti even on level-up — buy page stays calm).
9. Spacer (flex).
10. **Continue CTA** ("Continue") — routes to `/home`.

### 10.12 Freeze Bottom Sheet

**Triggered from:** Audit page "Freeze" button, Vault detail "Re-freeze" button.

**Purpose:** Capture item name + freeze duration.

**Sheet contents (Gluestack `Actionsheet`, ~70% screen height):**

1. Drag handle at top.
2. Title (`heading`): "Freeze this decision" (or "Re-freeze" if invoked from vault detail).
3. Vertical spacing (`5`).
4. **Item name input:** Gluestack `Input`, label "Name it", placeholder "What is it?". Required.
5. Vertical spacing (`6`).
6. **Duration label:** "Decide in…" (`body-lg`).
7. **Predefined duration chips** (horizontal wrap, `HobbyChip`-like styling but for duration):
   - "30 minutes"
   - "6 hours"
   - "1 day"
   - "1 week"
   - One chip selected at a time (single-select).
8. **Custom option** (separate row, full width):
   - For premium users: a tappable row "Custom duration" → expands inline (or opens nested input) showing two compact controls: numeric input + unit dropdown (minutes / hours / days). Selecting any custom value deselects the predefined chips.
   - For free users: same row but with a `PRO` lock badge on the right. Tapping opens the **Premium upsell sheet** instead.
9. Vertical spacing (`6`).
10. Sticky **"Freeze it"** button at the bottom of the sheet. Disabled until name is non-empty AND a duration is selected.

**On submit:**

- Creates (or updates, if re-freeze) a `tracked_item` row with `status='frozen'`, `name=<input>`, `freeze_until=<now + duration>`, `frozen_at=now()`, plus the price/currency snapshot.
- Schedules a local push notification via `expo-notifications` for `freeze_until` (only if user has notifications enabled).
- Closes the sheet, shows a brief Gluestack `Toast` ("Frozen until <relative time>"), routes to `/vault`.

### 10.13 Notifications Bottom Sheet

**Triggered from:** Bell icon in Shell B top app bar.

**Sheet contents (Gluestack `Actionsheet`):**

- Drag handle.
- Title (`heading`): "Notifications".
- Body:
  - **If unread notifications exist:** scrollable list of rows, newest first. Each row:
    - Left: item emoji (or default `Snowflake` Lucide icon if none) in a small rounded square `surface-alt` background.
    - Center: item name (`body-lg`), subtitle "Ready for a decision" (`caption`, `text-secondary`), price (`body-sm`, `text-secondary`).
    - Right: relative timestamp ("2h ago") in `caption`, `text-tertiary`.
    - Tap → marks as read (sync to Supabase), closes sheet, navigates to `/vault/[id]`.
  - **If no unread notifications:** centered text "You're all caught up." in `text-secondary`. No illustration. ~120px vertical padding.

### 10.14 Vault

**Route:** `/vault` (Shell B)

**Purpose:** Show all frozen items (active + thawed), let user revisit any of them.

**Layout (top to bottom):**

1. Top app bar: title "Vault" left, bell icon right.
2. **Body:**
   - **If items exist:** vertical scrollable list. Items sorted by `freeze_until ASC` (closest to thaw first). Thawed items naturally bubble to the top because their `freeze_until` is in the past.
   - Each row is a card (`surface` background, `raised` shadow, rounded `md`, padded `4`):
     - Left: small icon block (`Snowflake` for active, `Clock` for thawed) in a circular `primary-100` (active) or `accent-100` (thawed) background.
     - Middle: item name (`body-lg`), price in display currency (`body`, `text-secondary`), and a small secondary line:
       - **Active:** countdown (e.g., "5h 12m left"), in `text-secondary`. A small `CountdownPill` component renders this; it auto-refreshes every minute.
       - **Thawed:** Gluestack `Badge` with `accent-500` background and white text "Decision time".
     - Right: `ChevronRight` icon to indicate tappable.
     - Whole row is a `Pressable`. Tap → routes to `/vault/[id]`.
3. **Empty state** (when no items):
   - Centered illustration (smaller than hero illustrations, ~30% screen height). Subject: a soft snowflake or empty container (calm, not sad). See Section 13.
   - Vertical spacing.
   - Headline (`heading`, centered): "Nothing on ice."
   - Caption (`body`, `text-secondary`, centered, max 2 lines): "When you freeze a decision, it'll wait for you here."

### 10.15 Profile

**Route:** `/profile` (Shell B)

**Purpose:** Identity, stats, premium status, referral, settings.

**Layout (top to bottom, all blocks separated by vertical `6` spacing, padded `5` horizontal):**

1. Top app bar: title "Profile" left, bell icon right.

2. **Identity block** (centered content, vertical):
   - DiceBear avatar (~96px, `Avatar` Gluestack component, image source = DiceBear URL with seed = `user.id`).
   - Vertical spacing (`3`).
   - User name (`display-md`).
   - Below name, small row centered: `LevelBadge` (small, ~28px) + "L<n>" + tier name in `body`, `text-secondary`. E.g., "L4 · Aware".

3. **Progress block** (full-width card or just inline):
   - Gluestack `Progress` bar (`primary-500` fill, `surface-alt` track), showing decisions toward next level.
   - Below the bar, two-line caption row:
     - Left (`caption`, `text-secondary`): "<X> more to L<n+1>"
     - Right (`caption`, `text-tertiary`): "L<n+1>: <Tier name>"
   - At L20: bar fully filled, caption "Max level reached" centered.

4. **Total saved block** (a single soft `surface-alt` rounded card, padded inside):
   - Caption (`caption`, `text-secondary`, uppercase): "TOTAL SAVED"
   - Amount (`display-lg`, `text-primary`): formatted in display currency.

5. **Premium block** (a single row card):
   - **If premium:** Gluestack `Badge` (`primary-500` background) "PREMIUM" + "<N> days left" caption to the right. No CTA.
   - **If free:** Gluestack `Badge` (outline style, `text-secondary`) "FREE" + label "Get Premium →" on the right. Whole row tappable → opens **Premium upsell sheet**.

6. **Referral block** (card):
   - Caption (`caption`, `text-secondary`, uppercase): "YOUR REFERRAL CODE"
   - Code displayed prominently (mono font, `display-md` size, letter-spaced): e.g., "K7M2QP"
   - Copy button (Gluestack `Button` variant `outline`, full width, label "Copy code", `Copy` icon left). Tap → copies to clipboard, shows Gluestack `Toast` "Code copied".
   - Below copy button, small caption (`body-sm`, `text-secondary`): "You and your friend each get 3 months of Premium when they redeem your code."

7. **Settings list** (each row is a tappable list item, with `ChevronRight` on the right, divider between):
   - **Personal info** → opens **Personal Info edit bottom sheet**.
   - **Hobbies** → navigates to `/profile/hobbies`.
   - **Redeem code** → opens **Promo code redemption bottom sheet**.
   - **Notifications** — inline Gluestack `Switch` on the right (no chevron). Toggles `notifications_enabled`.
   - **Log out** → opens **Logout confirmation sheet**. Row text in `text-primary`.
   - **Delete account** → opens **Delete account confirmation sheet**. Row text in `danger` color.

### 10.16 Premium Upsell Sheet

**Triggered from:** Tapping the Premium row in profile (when free), tapping any locked feature (refresh suggestions, custom freeze, custom hobby).

**Sheet contents (Gluestack `Actionsheet`):**

- Drag handle.
- Centered top: Lucide `Sparkles` or `Crown` icon (~48px, `accent-500` color). No illustration.
- Title (`display-md`, centered): "Unlock Premium".
- Subtitle (`body`, `text-secondary`, centered): "Refresh suggestions, set custom freeze times, and add your own hobbies."
- Vertical spacing (`6`).
- **Benefits list** (3 rows, each with `Check` icon left, label right):
  - "Unlimited refresh of suggestions"
  - "Custom freeze durations"
  - "Add your own custom hobbies"
- Vertical spacing (`6`).
- Heading (`heading`): "Get Premium with a code"
- Caption (`body`, `text-secondary`): "Get a referral code from a friend, or use a promo code."
- **Single text input** (mono, auto-uppercase, centered text). Placeholder: "ENTER CODE".
- Inline error space (same error states as Section 6.6).
- Vertical spacing (`5`).
- **Primary CTA** "Redeem" (full width). Disabled until input non-empty.
- On success: this sheet closes, the **Successful redemption celebration sheet** opens.

### 10.17 Promo Code Redemption Sheet (Standalone)

**Triggered from:** Profile → "Redeem code" settings row.

Functionally identical to the input portion of the Premium upsell sheet — same layout, same validation, same success flow. The difference: this sheet is just the input + button (no benefits list above), since the user came here intentionally.

### 10.18 Successful Redemption Celebration Sheet

**Triggered from:** A successful code redemption from any entry point.

**Sheet contents (Gluestack `Actionsheet`, smaller height ~40%):**

- Drag handle.
- Centered: a small celebratory glyph — Lucide `Sparkles` icon, large (~64px), `celebrate-yellow` color. (No Lottie confetti here — that's reserved for skip.)
- Vertical spacing (`5`).
- Headline (`display-md`, centered): "🎉 Premium unlocked"
- Caption (`body-lg`, centered, `text-primary`): "3 months of Premium added to your account."
- If the user already had time remaining: secondary line (`body`, `text-secondary`): "You now have <N> days of Premium."
- Vertical spacing (`6`).
- **Primary CTA** "Awesome" (full width) → dismisses sheet.

### 10.19 Personal Info Edit Sheet

**Triggered from:** Profile → "Personal info" settings row.

**Sheet contents (Gluestack `Actionsheet`, scrollable, large height):**

- Drag handle.
- Title (`heading`): "Personal info".
- Form fields (same layout as onboarding step 2):
  - **Country** (tappable → Country bottom sheet) — editable.
  - **Display currency** (tappable → Currency bottom sheet) — editable.
  - **Hourly wage** + **wage currency** — editable. Changing wage or wage currency recalculates `hourly_wage_usd` using current rate.
  - **Work hours per day** — editable.
- **Not editable (per requirement):** name, birthdate, email, password.
- Sticky "Save" button at bottom.
- On save: updates user record, closes sheet, shows Toast "Updated."

**Side effect:** Changing country invalidates all `user_suggestion` rows (per ADR-004 R3). Suggestions regenerate on the next audit page load.

### 10.20 Hobbies Sub-Screen

**Route:** `/profile/hobbies` (Shell B but title "Hobbies", with back arrow)

**Purpose:** Edit the hobby list. Premium users can add custom hobbies here.

**Layout:**

1. Top app bar: back arrow, title "Hobbies", bell icon right.
2. **Selected hobbies counter** (`caption`, right-aligned, padded): "<N> selected"
3. **Hobby grid** — same grid as onboarding step 3, with chips for all `predefined_hobby` rows. Currently selected hobbies are in their selected state. Tapping toggles selection. Minimum 3 enforced — if user tries to deselect when count would go to 2, a Toast appears: "Keep at least 3 hobbies."
4. Below the grid:
   - For premium users: a separate **"Add custom hobby"** row (a Pressable, `surface-alt` background, rounded, with `Plus` icon and label). Tap → opens a small bottom sheet with a text input ("My hobby"). Submit → calls `moderate-custom-hobby` Edge Function async; shows the new hobby chip immediately with a small "Pending review" badge until moderation completes.
   - For free users: same row but with a `PRO` lock badge. Tap → opens **Premium upsell sheet**.
5. Custom hobbies (after moderation) appear inline in the grid mixed with predefined ones, indistinguishable in styling.
6. **No save button.** Changes save automatically on each toggle (debounced briefly to coalesce rapid taps).

### 10.21 Logout Confirmation Sheet

**Triggered from:** Profile → "Log out" row.

**Sheet contents (Gluestack `Actionsheet`, small height ~30%):**

- Drag handle.
- Title (`heading`, centered): "Log out?".
- Caption (`body`, `text-secondary`, centered): "You'll need to log in again to use BadBuy."
- Vertical spacing.
- **Primary CTA** "Log out" (full width, default primary).
- **Secondary CTA** "Cancel" (full width, ghost/link).
- On confirm: Supabase `signOut()`, route to `/landing`.

### 10.22 Delete Account Confirmation Sheet

**Triggered from:** Profile → "Delete account" row.

**Sheet contents:**

- Drag handle.
- Title (`heading`, centered, `danger` color): "Delete your account?".
- Caption (`body`, `text-secondary`, centered, max 3 lines): "This will permanently delete your profile, your decisions history, your hobbies, and any Premium time you have left. This cannot be undone."
- Vertical spacing.
- **Destructive primary CTA** "Delete account" — Gluestack `Button` with action `negative` or custom-styled with `danger` background.
- **Secondary CTA** "Cancel" (ghost).
- On confirm: calls Supabase to delete user record (cascades to all owned rows), signs out, routes to `/landing`.

---

## 11. Reusable Components & Patterns

This section catalogues the custom components introduced beyond Gluestack UI v3 and documents recurring patterns to keep implementation consistent.

### 11.1 Custom Component Catalog

| Component           | Where used                                                   | Description                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SwipeToConfirm`    | Audit decision block                                         | Horizontal track with draggable handle. Props: `label`, `onConfirm`, `hapticTicks` (boolean). Internal: uses `react-native-reanimated` for the drag gesture, `expo-haptics` for tick + success haptics. Confirmed by reaching ≥95% of track width. |
| `PriceInput`        | Home, freeze sheet (price display only)                      | Large price field with inline currency selector. Props: `value`, `onValueChange`, `currency`, `onCurrencyTap`, `autoFocus`, `placeholder`.                                                                                                         |
| `HobbyChip`         | Onboarding hobbies, profile hobbies                          | Selectable pill. Props: `label`, `icon` (Lucide icon component or null), `selected`, `onToggle`, `lockBadge` (boolean).                                                                                                                            |
| `LevelBadge`        | Profile, skip page, buy page (level-up state)                | Circular badge. Props: `level` (1–20), `size` (sm/md/lg). Color derived internally from level → tier.                                                                                                                                              |
| `CountdownPill`     | Vault list rows                                              | Auto-updating countdown text. Props: `until` (timestamp). Re-renders every 60s. Format: "5d 3h", "2h 14m", "12 min", "<1 min".                                                                                                                     |
| `ConfettiBlast`     | Skip page                                                    | Lottie wrapper. Plays a single Lottie file once on mount. Props: `onComplete` (optional callback).                                                                                                                                                 |
| `PremiumLockBadge`  | Refresh button (audit), custom freeze chip, custom hobby row | Small "PRO" pill overlay. Props: `position` (top-right / inline). Uses `accent-500` background, `text-inverse` text, very small caption font.                                                                                                      |
| `IllustrationFrame` | Landing, onboarding intros, skip, buy, vault empty state     | Container that handles aspect ratio, max width, and centering for hero illustrations. Props: `source` (image asset), `aspectRatio`, `maxHeight`.                                                                                                   |
| `StepProgressBar`   | Onboarding shell                                             | Segmented horizontal bar. Props: `currentStep`, `totalSteps`. Filled segments in `primary-500`, empty in `border` color.                                                                                                                           |
| `ScreenContainer`   | Every screen                                                 | Wrapper that handles safe areas, default screen padding, and optionally a sticky bottom action bar. Props: `stickyBottom` (React node or null).                                                                                                    |
| `StatCard`          | Home (saved-amount block), Profile (total saved)             | Soft card with caption + large number. Props: `caption`, `value`, `valueSize` (display-lg / display-md).                                                                                                                                           |
| `SettingsRow`       | Profile settings list                                        | Standard list row with label, optional icon, optional right adornment (chevron, switch, badge), tap handler.                                                                                                                                       |

### 11.2 Recurring Patterns

**Sheet padding:** all bottom sheets use `5` horizontal and `5` top / `6` bottom (above safe area) internal padding. Drag handle at top with `2` margin below.

**Sticky CTA bottom area:** On screens with a primary action (onboarding steps, freeze sheet, profile sub-sheets), the CTA sits above the safe area with `5` horizontal padding and a soft top border (`border` color) to separate it from scrolling content. The CTA itself is the full content width (screen width minus padding).

**Form field labels:** label sits above the input, `body-sm` weight, `text-secondary`. Optional info icon `i` (Lucide `Info`, 14px, `info` color) inline at the end of the label, tappable, opens a small inline popover or a quick toast with the explanation.

**Disabled CTAs:** opacity 0.5, no color change, no interaction. Never grey out by changing the brand color — always use opacity.

**Error inline copy:** `body-sm`, `danger` color, no icon, sits directly under the relevant field with `2` vertical margin.

**Toasts:** Gluestack `Toast`, default position bottom, 2.5s default duration. Use for non-destructive confirmations only ("Code copied", "Updated", "Frozen until 5 PM"). Never use for errors — those are inline.

**Loading buttons:** Replace label with Gluestack `Spinner` of matching color (e.g., `text-inverse` on primary buttons). Button stays at full width. Disabled during loading.

**Decision page transitions:** From audit to skip / buy / freeze, transitions are simple slide-from-right (default Expo Router). No custom animations in v1 (deferred to v1.1).

### 11.3 Haptic Feedback Map

Using `expo-haptics`:

| Trigger                          | Haptic                                                        |
| -------------------------------- | ------------------------------------------------------------- |
| Swipe-to-skip handle reaches 25% | `Haptics.selectionAsync()`                                    |
| 50%                              | `Haptics.selectionAsync()`                                    |
| 75%                              | `Haptics.selectionAsync()`                                    |
| 100% (skip confirmed)            | `Haptics.notificationAsync(NotificationFeedbackType.Success)` |
| Code redemption success          | `Haptics.notificationAsync(Success)`                          |
| Hobby chip toggle                | (none — too noisy)                                            |
| Bottom sheet open/close          | (none — handled by Gluestack)                                 |

---

## 12. Empty, Loading & Error States

A consolidated reference of every non-default state across screens.

### 12.1 Empty States

| Screen                    | Empty Condition                  | Treatment                                                                                                           |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Home — saved amount       | No skipped items in last 30 days | Amount renders as "—". Caption: "Nothing yet — your first skip will land here."                                     |
| Audit — alternatives list | Fewer than 5 suggestions exist   | Show what's there + placeholder row "More coming soon."                                                             |
| Vault                     | No tracked items at all          | Centered illustration + headline "Nothing on ice." + caption "When you freeze a decision, it'll wait for you here." |
| Notifications panel       | No unread notifications          | Centered text "You're all caught up." in `text-secondary`. No illustration.                                         |
| Profile — referral block  | (always populated, never empty)  | —                                                                                                                   |

### 12.2 Loading States

| Screen                                | Loading Condition                                  | Treatment                                                                               |
| ------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Login / Register submit               | Network call in flight                             | Button label replaced with `Spinner`, button disabled                                   |
| Onboarding step submit                | Saving user                                        | Same as above                                                                           |
| Audit — work hours                    | (instantaneous, no loading)                        | —                                                                                       |
| Audit — alternatives                  | First call to `generate-suggestions` for this user | Centered `Spinner` in alternatives section + caption "Brewing some ideas…"              |
| Audit — refresh suggestions (premium) | Refresh in flight                                  | `RefreshCw` icon spins; rows briefly fade to half opacity                               |
| Code redemption                       | Backend validating                                 | Submit button shows `Spinner`                                                           |
| Freeze sheet submit                   | Creating tracked_item                              | Submit button shows `Spinner`                                                           |
| Vault list                            | Initial load                                       | Skeleton rows (3–4 placeholder rows with shimmering `surface-alt` blocks)               |
| Profile                               | Initial load                                       | Skeleton blocks (avatar circle, name line, progress bar, stat card, settings list rows) |
| Notifications panel                   | Loading from Supabase                              | Brief skeleton, then content. (Usually negligible.)                                     |

### 12.3 Error States

| Screen                                 | Error Condition                | Treatment                                                                                     |
| -------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| Login                                  | Wrong credentials              | Inline below form: "Email or password is incorrect."                                          |
| Login / Register                       | Network failure                | Inline below form: "Couldn't connect. Try again."                                             |
| Register                               | Email exists                   | Inline below email field: "An account with this email already exists."                        |
| Register                               | Weak password / mismatch       | Inline per field                                                                              |
| Onboarding submit                      | Network failure                | Inline above the Continue button: "Couldn't save. Try again."                                 |
| Audit — alternatives generation failed | API/AI failure                 | Section replaced with centered "Couldn't load suggestions" + small primary "Try again" button |
| Audit — refresh failed                 | Network failure during refresh | Brief Toast at bottom: "Couldn't refresh. Try again." Suggestions list remains as it was.     |
| Freeze submit failure                  | Network/DB error               | Inline above the submit button: "Couldn't freeze. Try again." Sheet stays open.               |
| Code redemption failures               | (per Section 6.6)              | Inline below the input field                                                                  |
| Profile load failure                   | Network failure                | Centered text + retry button. Rare — RLS/network only.                                        |
| Notifications load failure             | Network failure                | Sheet shows "Couldn't load notifications. Try again." with retry text link.                   |
| Logout                                 | Network failure                | Sheet stays open with inline error "Couldn't log out. Try again."                             |
| Delete account                         | Network failure                | Same pattern.                                                                                 |

### 12.4 Pending / In-Between States

| Case                                                                         | Treatment                                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom hobby added (premium), awaiting moderation                            | Hobby chip appears immediately in selected state, with a small `Clock` icon overlay or "Pending" badge. Caption tooltip on tap: "We're reviewing this hobby. It'll start powering suggestions soon." |
| Premium expired mid-session                                                  | UI reactively updates to free state — locked features re-show `PRO` badges. No modal interruption. The next time the user opens profile, the premium pill reflects "Free."                           |
| Push permission denied at OS level but `notifications_enabled = true` in app | App still creates in-app notification rows (bell badge appears). No prompt to re-enable in v1.                                                                                                       |

---

## 13. Asset Inventory

All visual assets needed for v1, with the type, dimensions, and a rough description. The actual generation prompts will be produced in a separate document.

| #   | Asset                                     | Type                                         | Size / Format                                    | Description Summary                                                                                                                                                           |
| --- | ----------------------------------------- | -------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | App icon                                  | Static raster                                | 1024×1024 master, exported at all platform sizes | Brand mark — soft, calm, recognizable at small sizes. Likely a stylized abstract motif (e.g., a paused circle, a soft snowflake) in primary palette.                          |
| 2   | Splash screen                             | Static raster + background                   | 1242×2688 (iOS), various Android                 | Centered minimal logo on `bg` background. No text.                                                                                                                            |
| 3   | Landing hero illustration                 | Static raster (PNG with transparency) or SVG | ~1080×1080 working size                          | Calm scene: a person pausing thoughtfully with abstract floating objects. Warm palette.                                                                                       |
| 4   | Onboarding step 1 illustration (Identity) | Static raster                                | ~1080×800 working size                           | Soft scene representing identity / self. E.g., a gentle silhouette, a soft sunrise, abstract avatar shapes.                                                                   |
| 5   | Onboarding step 2 illustration (Money)    | Static raster                                | ~1080×800 working size                           | Soft scene representing time / value. E.g., a clock blending into coins, abstract balance scales.                                                                             |
| 6   | Onboarding step 3 illustration (Hobbies)  | Static raster                                | ~1080×800 working size                           | Soft scene with multiple symbolic hobby objects floating gently (instrument silhouette, bicycle, leaf).                                                                       |
| 7   | Vault empty state illustration            | Static raster                                | ~800×800 working size                            | A soft snowflake or empty container scene. Calm, not sad.                                                                                                                     |
| 8   | Skip page illustration                    | Static raster                                | ~1080×1080 working size                          | Joyful but warm: a person in a calm victorious pose, or a blooming flower / released balloon. Brighter palette than other illustrations (uses celebration colors as accents). |
| 9   | Buy page illustration                     | Static raster                                | ~1080×1080 working size                          | Content, settled scene: a wrapped gift, a hand holding something carefully, or an abstract "checked" feel. Same warm palette but no celebration colors.                       |
| —   | Confetti animation                        | Lottie JSON                                  | ~3–5s loop, plays once                           | Multi-color confetti fall using celebration palette (yellow, pink, teal).                                                                                                     |

All onboarding and decision illustrations should share a consistent style (same hand, same palette discipline) so they read as a family. The skip illustration may push slightly more vibrant within the same family.

---

## 14. Out of Scope for v1

Documented explicitly so design and engineering don't accidentally specify or build these:

- Dark theme.
- Localization (UI is English only).
- Email verification on register.
- Forgot / reset password.
- Changing email or password from settings.
- Editing name or birthdate from settings.
- Image / photo input on the audit (camera, image picker, OCR receipt scanning).
- A "mindful buys" history page showing past buy decisions.
- Streak tracking (`skipped_streak` field is removed from the schema; replaced by `decision_count`).
- Sharing skipped decisions to social or to friends.
- Native share sheet integration for the referral code (copy-to-clipboard only).
- Deep links for referral codes (e.g., `badbuy://redeem/K7M2QP`).
- Push notification copy that names the specific item ("Time to decide on your snowboard" — generic only in v1).
- "Mark all read" on notifications.
- Filters or sorts on the vault list.
- In-app purchases / Apple Pay / Google Pay / Stripe — premium is referral-only.
- Premium expiry reminders or banners.
- Multiple currencies on a single tracked item.
- Web / iPad / desktop versions.
- Stitch / Figma export pipeline (the docs themselves are the source of truth).

---

## 15. Open Decisions & Future Work

These are decisions that were intentionally deferred or that will need attention before v1 ships.

### 15.1 Decisions to Make Before Build

1. **Final hobby seed list.** ~40 hobbies across categories — needs to be enumerated and reviewed with the team. The schema is ready; the content is not.
2. **Final seed promo codes.** The team needs to choose how many initial seed codes to mint (e.g., one `LAUNCH2026` with 500 uses, plus event-specific codes).
3. **Free exchange rate API choice.** ADR-004 mentions "a currency exchange API" generically. Recommended: `exchangerate.host` (no API key, returns USD-base) or `openexchangerates.org` free tier (1k calls/month, USD-base). Pick one before implementing the cron.
4. **AI provider for `generate-suggestions`.** Likely an LLM call (OpenAI / Anthropic). Cost estimate, prompt design, JSON output schema — to be defined in a follow-up technical spec.
5. **DiceBear style.** DiceBear has many styles (`avataaars`, `bottts`, `lorelei`, `notionists`, etc.). Recommend `lorelei` or `notionists` for the calm aesthetic. Final choice: TBD.

### 15.2 Reasonable v2 Candidates

- Dark theme.
- Push notification copy with item name.
- Buy history / mindful buys page.
- Native share sheet for referral.
- Deep link support for referrals.
- Image / photo input at audit time.
- Localization (priority languages: Czech, French, Spanish based on team market).
- Premium expiry reminder (in-app banner at 7 days remaining).
- "Mark all read" on notifications.
- A streak feature (separate from the decision count, e.g., consecutive days with at least one decision).
- Custom XP system layered on top of decision count.
- Real payments as a fallback for users who can't get a referral code.

### 15.3 Risks Carried Over from ADRs

| Source     | Risk                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| ADR-001 R1 | RLS misconfiguration. Mitigated via early policy modeling and code review.                              |
| ADR-002 R2 | React Native learning curve. Mitigated via pair work and Expo's managed workflow.                       |
| ADR-003 R1 | Shared layer becomes a dumping ground. Mitigated via the import rule in code review.                    |
| ADR-004 R3 | Stale suggestions after profile change. Handled: country/currency change invalidates `user_suggestion`. |
| ADR-005 R2 | Gluestack component coverage gap. Mitigated by the custom component catalog (Section 11.1).             |

---

_End of document._
