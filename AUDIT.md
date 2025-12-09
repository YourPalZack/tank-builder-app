# AquaBuilder Audit — Required Next Steps

## Current coverage
- UI shell exists (sidebar category launcher, dashboard, part browser modal, shopping list) with Zustand-backed build state and basic save/load (Clerk + Drizzle/Neon or local fallback store).
- Compatibility engine only checks water-parameter overlap, simple stocking thresholds, schooling warnings, and basic aggression/tank-size errors.
- Catalog fetch relies on server actions (Drizzle + Supabase/Neon schema) and optional Amazon PA API search; sample data is present but not wired as a fallback.

## Gaps to close / features to create
1) **Data + platform readiness**
   - Provide DATABASE_URL/Clerk envs and a seed/migration path so `tanks/species/plants/equipment/substrates` tables contain the sample catalog; add a local fallback to `data/sampleData.ts` so the app works without the database.
   - Harden SWR hooks and server actions with error/empty-state handling to avoid runtime crashes when env/config is missing.

2) **Compatibility engine completeness**
   - Add equipment checks (filter GPH vs tank volume/bioload, heater wattage vs gallons, light vs plant light/CO₂ needs, CO₂-required plants, substrate safety for plants/bottom dwellers, flow too strong/weak).
   - Expand spatial/behavior checks (territory overlap, level crowding, predator/prey sizing by mouth/size, plant-eater flags, plant-incompatible fish/inverts) and surface suggestions, not only errors.

3) **Catalog & selection UX**
   - Broaden filters per category (water type, size/temperament ranges for fish/inverts; light/CO₂/substrate for plants; flow/wattage/length for equipment) and add quantity pickers in the browser/cards.
   - Improve PartBrowser resilience: guard Amazon search behind key checks with a clear empty state; cache or hydrate with local data when remote queries fail.
   - Populate Build Wizard templates with real catalog IDs (tank + starter fish/plants/equipment) instead of tank-only stubs.

4) **Persistence, sharing, and exports**
   - Add shareable build links/IDs (read-only view + import/clone) and CSV/print-friendly exports for the shopping list.
   - Ensure build saves include computed fields (target params, substrate bags) and migrations keep schema in sync.

5) **Quality bar**
   - Add unit tests for compatibility functions (water overlap, stocking thresholds, predator/prey, CO₂/substrate rules) and store mutations.
   - Add lightweight integration tests for add/remove flows in the PartBrowser and saved-build lifecycle.
