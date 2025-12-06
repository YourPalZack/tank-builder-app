# AquaBuilder – Purchase Links Integration Spec for GitHub Copilot Agent

## Purpose

You are a GitHub Copilot Agent working inside VS Code on the **AquaBuilder** project (Next.js + TypeScript + Tailwind + Zustand). Your task is to **add “Where to Buy” purchase links** for items in the app, using:

- **Amazon** for equipment, plants, substrates, and some invertebrates  
- **Dan’s Fish and other specialty fish vendors** for fish and select invertebrates  

The feature must be implemented using **clean architecture, reusable components, and best practices**, without breaking existing functionality.

---

## High-Level Requirements

1. Extend the data models so that **fish, plants, equipment, substrates, and invertebrates** can include one or more purchase links.
2. Implement **utility functions** that generate purchase URLs for:
   - Amazon (using an affiliate tag from environment variables)
   - Dan’s Fish and other fish vendors using search-query URLs
3. Add a **reusable “Where to Buy” UI component** that can be used in:
   - Item detail modals
   - Build summary views
   - Shopping list / export views
4. Add **user preferences** for preferred vendors and use them to **sort and filter** visible purchase links.
5. Ensure the implementation follows:
   - TypeScript best practices
   - Tailwind CSS for styling
   - Accessibility and semantic HTML
6. Keep the codebase **consistent**, well-typed, and easy to extend.

---

## Project Assumptions

Assume the project has or will have:

- `Next.js 14+` using the App Router (`/app`)
- `TypeScript` with strict mode
- `Tailwind CSS`
- A `Zustand` store in `/store`
- Type definitions in `/types`
- Static sample data in `/data`
- Utility modules in `/lib`

If a folder does not exist yet, create it in a way that is consistent with the rest of the project structure.

---

## Part 1: Data Model Updates

### 1.1 Create a PurchaseLink Model

**File to create (if not present):**  
`/types/purchasing.ts`

Define a shared purchase link model and a base interface that other entities can extend.

```ts
// /types/purchasing.ts
export interface PurchaseLink {
  vendor: string;            // 'Amazon', 'DansFish', 'AquaHuna', 'FlipAquatics', etc.
  url: string;               // direct URL to product or search results
  price?: number;            // optional, if known
  availability?: 'in-stock' | 'out-of-stock' | 'seasonal' | 'unknown';
  affiliate?: boolean;       // true if this link uses an affiliate program
}

export interface PurchasableItem {
  purchaseLinks?: PurchaseLink[];
}
```

### 1.2 Extend Existing Entities

Update types for:

- `Fish`
- `Plant`
- `Equipment`
- `Substrate`
- `Invertebrate`

**Files (examples):**

- `/types/fish.ts`
- `/types/plants.ts`
- `/types/equipment.ts`
- `/types/substrate.ts`
- `/types/invertebrates.ts`

For each type, extend `PurchasableItem`:

```ts
import type { PurchasableItem } from './purchasing';

export interface Fish extends PurchasableItem {
  // existing fields like id, commonName, scientificName, etc.
}
```

Repeat this pattern for `Plant`, `Equipment`, `Substrate`, and `Invertebrate`.

**Important:**  
Do not break existing constructors or data loading logic. If `purchaseLinks` is undefined, the UI should handle that gracefully.

---

## Part 2: Vendor Configuration

### 2.1 Create a Vendor Configuration File

**File to create:**  
`/lib/vendors.ts`

This file centralizes vendor names and base URLs.

```ts
// /lib/vendors.ts
export const VENDORS = {
  AMAZON: 'Amazon',
  DANS_FISH: "Dan's Fish",
  AQUA_HUNA: 'Aqua Huna',
  FLIP_AQUATICS: 'Flip Aquatics',
} as const;

export type VendorKey = keyof typeof VENDORS;

export const vendorDisplayNames: Record<VendorKey, string> = {
  AMAZON: 'Amazon',
  DANS_FISH: "Dan's Fish",
  AQUA_HUNA: 'Aqua Huna',
  FLIP_AQUATICS: 'Flip Aquatics',
};
```

---

## Part 3: URL Builders and Affiliate Handling

### 3.1 Create a Purchase Utility Module

**File to create:**  
`/lib/purchasing.ts`

Responsibilities:

- Build **Amazon** search URLs for equipment, plants, substrates, and inverts.
- Build **Dan’s Fish**, **Aqua Huna**, and **Flip Aquatics** search URLs for fish.
- Append the Amazon affiliate tag using an environment variable.

**Environment variable:**

```bash
NEXT_PUBLIC_AMAZON_TAG=your-affiliate-tag-20
```

**Implementation outline:**

```ts
// /lib/purchasing.ts
import { VENDORS } from './vendors';

const getAmazonTag = () => process.env.NEXT_PUBLIC_AMAZON_TAG;

const appendAffiliateTag = (url: string): string => {
  const tag = getAmazonTag();
  if (!tag) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tag=${encodeURIComponent(tag)}`;
};

export const buildAmazonSearchUrl = (query: string): string => {
  const base = 'https://www.amazon.com/s';
  const params = new URLSearchParams({ k: query });
  return appendAffiliateTag(`${base}?${params.toString()}`);
};

export const buildDansFishSearchUrl = (scientificName: string): string => {
  const base = 'https://www.dansfish.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};

export const buildAquaHunaSearchUrl = (scientificName: string): string => {
  const base = 'https://aquahuna.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};

export const buildFlipAquaticsSearchUrl = (scientificName: string): string => {
  const base = 'https://flipaquatics.com/search';
  const params = new URLSearchParams({ q: scientificName });
  return `${base}?${params.toString()}`;
};
```

### 3.2 Helper: Generate Default Purchase Links for Items

Add functions to generate default `PurchaseLink[]` when curated links are not present.

Example for equipment:

```ts
import type { Equipment } from '@/types/equipment';
import type { PurchaseLink } from '@/types/purchasing';
import { VENDORS } from './vendors';
import { buildAmazonSearchUrl } from './purchasing';

export const getEquipmentPurchaseLinks = (item: Equipment): PurchaseLink[] => {
  const query = `${item.brand} ${item.name}`.trim();
  const links: PurchaseLink[] = [];

  links.push({
    vendor: VENDORS.AMAZON,
    url: buildAmazonSearchUrl(query),
    affiliate: true,
  });

  return item.purchaseLinks?.length ? item.purchaseLinks : links;
};
```

Create similar helpers for:

- `Fish` using Dan’s Fish, Aqua Huna, and Flip Aquatics (search by scientific name first, then common name as fallback).
- `Plant` using Amazon search (brand + name, or name only).
- `Substrate` using Amazon search.
- `Invertebrate` using the most appropriate mix of vendors.

---

## Part 4: User Vendor Preferences (Zustand Store)

### 4.1 Extend the Global Store

**File (example):**  
`/store/useSettingsStore.ts`

Add vendor preference settings:

```ts
interface VendorSettings {
  preferredVendors: string[]; // e.g. ['Amazon', "Dan's Fish"]
}

interface SettingsState extends VendorSettings {
  setPreferredVendors: (vendors: string[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  preferredVendors: ['Amazon', "Dan's Fish"],
  setPreferredVendors: (vendors) => set({ preferredVendors: vendors }),
}));
```

### 4.2 Helper to Filter and Sort Vendors

In `/lib/purchasing.ts` or a dedicated helper, add:

```ts
import type { PurchaseLink } from '@/types/purchasing';

export const filterAndSortPurchaseLinks = (
  links: PurchaseLink[],
  preferredVendors: string[]
): PurchaseLink[] => {
  if (!links.length) return [];

  const preferredSet = new Set(preferredVendors);

  return [...links].sort((a, b) => {
    const aPreferred = preferredSet.has(a.vendor);
    const bPreferred = preferredSet.has(b.vendor);

    if (aPreferred && !bPreferred) return -1;
    if (!aPreferred && bPreferred) return 1;
    return 0;
  });
};
```

---

## Part 5: Reusable “Where to Buy” UI Component

### 5.1 Component File

**File to create:**  
`/components/WhereToBuySection.tsx`

Requirements:

- Accepts `purchaseLinks: PurchaseLink[]`
- Accepts optional heading text
- Fetches vendor preferences from `useSettingsStore`
- Uses Tailwind classes for styling
- Handles empty links gracefully

Outline:

```tsx
import React from 'react';
import type { PurchaseLink } from '@/types/purchasing';
import { useSettingsStore } from '@/store/useSettingsStore';
import { filterAndSortPurchaseLinks } from '@/lib/purchasing';

interface WhereToBuySectionProps {
  purchaseLinks: PurchaseLink[] | undefined;
  title?: string;
}

export const WhereToBuySection: React.FC<WhereToBuySectionProps> = ({
  purchaseLinks,
  title = 'Where to Buy',
}) => {
  const preferredVendors = useSettingsStore((s) => s.preferredVendors);
  const sortedLinks = filterAndSortPurchaseLinks(purchaseLinks ?? [], preferredVendors);

  if (!sortedLinks.length) {
    return null;
  }

  return (
    <section className="mt-6">
      <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {sortedLinks.map((link) => (
          <div
            key={`${link.vendor}-${link.url}`}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">
                {link.vendor}
              </span>
              {link.availability && (
                <span className="text-xs text-slate-500">
                  {link.availability === 'in-stock' ? 'In stock' : link.availability}
                </span>
              )}
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
            >
              Visit
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

## Part 6: Integrating “Where to Buy” Into Existing UI

### 6.1 Item Detail Modals

Wherever you show details for:

- Fish
- Plants
- Equipment
- Substrate
- Invertebrates

Import `WhereToBuySection` and the appropriate helper (`getEquipmentPurchaseLinks`, `getFishPurchaseLinks`, etc.), then render it at the bottom of the modal content.

Example (Equipment detail modal):

```tsx
import { WhereToBuySection } from '@/components/WhereToBuySection';
import { getEquipmentPurchaseLinks } from '@/lib/equipmentPurchasing';

const EquipmentDetailModal: React.FC<{ item: Equipment }> = ({ item }) => {
  const links = getEquipmentPurchaseLinks(item);

  return (
    <div>
      {/* existing detail UI */}
      <WhereToBuySection purchaseLinks={links} />
    </div>
  );
};
```

Repeat for fish, plants, substrate, and invertebrates using their respective helpers.

### 6.2 Build Summary View

In the build summary sidebar or “Build Overview” page:

- For each category (fish, plants, equipment, etc.), optionally show a **condensed list of purchase links** or a **“View shopping list” button** that leads to a dedicated page.

---

## Part 7: Optional Shopping List Page

If the project includes or will include a shopping list/export feature, create:

**File to create:**  
`/app/shopping-list/page.tsx`

Responsibilities:

- Read current build from Zustand or URL
- Compile all items into a list
- Show grouped purchase links under each item
- Allow export or print

This page is optional but highly useful for users who want a complete purchasing checklist.

---

## Part 8: Basic SEO and Accessibility

1. Ensure that “Where to Buy” headings use semantic `<h3>` or `<h2>` as appropriate.  
2. Buttons and links must be keyboard accessible and have clear text such as “Visit” rather than vague labels.  
3. Optionally, add JSON-LD schema for Product and Offer when rendering detailed product pages, but do not block the UI work waiting on that.

---

## Copilot Working Style Instructions

When you as Copilot modify this project, follow these guidelines:

1. **Open and read** existing files before editing to understand patterns and naming conventions.
2. Prefer **small, focused PR-sized changes** instead of large, monolithic edits.
3. Use **TypeScript types** consistently and avoid `any`.
4. Keep all styling in **Tailwind CSS utility classes**, not inline CSS.
5. Make new utilities and helpers **pure functions** where possible.
6. Run or ensure compatibility with existing **linting and type-checking** tools if configured.
7. When unsure, favor **simple, explicit solutions** rather than clever abstractions.

---

## Summary of Steps for Copilot to Execute

1. Create `/types/purchasing.ts` and extend all relevant entity types to include `PurchasableItem`.
2. Create `/lib/vendors.ts` and define vendor constants.
3. Create `/lib/purchasing.ts` with:
   - Affiliate handling
   - Amazon search URL builder
   - Dan’s Fish, Aqua Huna, Flip Aquatics search URL builders
   - Helper(s) to generate default `PurchaseLink[]` for each item type
4. Extend the settings store (`/store/useSettingsStore.ts`) to support user vendor preferences.
5. Add `filterAndSortPurchaseLinks` helper.
6. Create the reusable UI component `/components/WhereToBuySection.tsx`.
7. Integrate `WhereToBuySection` into:
   - Fish detail modal
   - Plant detail modal
   - Equipment detail modal
   - Substrate and invertebrate detail views
8. Optionally, create a shopping list page in `/app/shopping-list/page.tsx`.
9. Confirm TypeScript builds without errors and that the new UI does not break existing layouts.

This spec is the single source of truth for adding purchase links and “Where to Buy” functionality to AquaBuilder using GitHub Copilot Agent in VS Code.
