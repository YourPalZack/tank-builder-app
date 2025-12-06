AquaBuilder – The Ultimate Aquarium Compatibility App
Overview

AquaBuilder is a Next.js-powered application designed as the PCPartPicker for aquarium enthusiasts. It allows hobbyists to plan and “build” a complete aquarium setup by selecting a tank, fish, plants, invertebrates, equipment, and substrate, all while ensuring real-time compatibility checks across multiple factors. This prevents common mistakes that can lead to stressed fish or tank failures. Successful aquariums depend on well-matched tank mates and conditions – incompatible species can cause stress, disease, or even fish loss
liveaquaria.com
. AquaBuilder addresses this by continuously validating that water parameters, temperament, space needs, and equipment capacity all align in the user’s chosen setup. The result is an interactive, intelligent stocking calculator and planning tool that goes far beyond simplistic “inch-per-gallon” rules or basic charts.

Key Concept: AquaBuilder’s core innovation is a comprehensive compatibility rules engine (detailed below) paired with a rich user interface. As the user adds each item, the app immediately flags issues (with warnings or errors) and offers suggestions. This mirrors how PCPartPicker guides PC builds by warning of incompatible components, but applied to the aquarium domain – a far more complex problem due to the many biological and environmental variables
aqadvisor.com
aqadvisor.com
. By leveraging an extensive knowledge base of species traits and equipment specs, AquaBuilder helps both beginners and advanced aquarists design balanced, healthy aquariums with confidence.

Design Direction

AquaBuilder’s design creates an immersive aquatic atmosphere that is both visually engaging and functionally clear. The UI will have a modern, sleek aesthetic inspired by underwater environments:

Color Scheme & Theme: A default dark mode interface with deep ocean blues as the primary background (#0a1628, #0d2137) to reduce eye strain and evoke the feeling of looking into an aquarium. Teal accents (#14b8a6, #22d3ee) provide contrast for interactive elements (buttons, highlights) – these bright aqua tones mimic bioluminescent glows of underwater creatures for emphasis. The overall vibe is a cool, underwater tranquility, with dark translucent panels (frosted glass effect) floating above background imagery.

Typography: Use “Outfit” font for headings (a clean, modern sans-serif that suggests a technical yet friendly tone) and “Source Sans 3” for body text (highly legible for detailed information). Headings will be slightly larger and in a light color for contrast against the dark background, while body text will be softer gray/white for readability. This combination gives a professional but approachable feel, suitable for both technical data and explanatory text.

Visual Effects: Subtle water caustics animation will play in the background, giving the impression of light filtering through rippling water. This can be achieved with a looping SVG filter or CSS animation to create moving highlights and shadows, lending depth to the UI without distracting the user. UI cards and modals use glassmorphism: translucent panels with backdrop blur (simulating frosted glass) so that hints of the moving water background show through. This reinforces the underwater theme while maintaining contrast for content. Transitions between views (like opening the part selection modal) are smooth, wave-like animations – e.g. a modal might slide in with an easing that mimics a gentle wave. Hover effects on buttons and cards could include a slight “ripple” or scaling to suggest fluid motion.

Iconography: Custom aquatic-themed icons are used throughout the interface for intuitive recognition. For example, category icons: a tank icon 🐟 for the Tank section, a fish silhouette for Fish, a leaf for Plants, a snail or shrimp icon for Invertebrates, filter/heater/light icons for equipment, and a pebble icon for Substrate. Status indicators for compatibility use familiar symbols (✔️ for compatible, ⚠️ for warnings, ❌ for incompatibilities) but styled to match the theme (perhaps with a bubble or shield design around them). Where color is used (green/yellow/red), icons and labels will also include shape or text cues to be color-blind friendly (e.g. the warning icon includes an exclamation mark, error icon is an “X”)
medium.com
. Minor animations add delight – e.g. the logo could incorporate an animated water ripple when hovered, or the compatibility status icon might gently pulse if there are issues requiring attention.

Layout: The app features a dashboard-style layout optimized for widescreen but responsive to smaller devices. The main build canvas is at the center, with supporting panels around it:

A top header bar (detailed below) for navigation and controls.

A left sidebar (or collapsible panel) listing categories of parts to add.

The central area showing the current build overview (tank image and stats).

A bottom persistent bar for critical alerts (compatibility summary).

On large screens (desktop), users see a two-column layout: for example, the tank image and key stats on the left, and a summary of the build on the right. This was illustrated in the specification’s mockup, where the tank preview and a compatibility status widget sat beside a summary of totals and key warnings. On smaller screens (tablet), panels can collapse into accordion sections, and on mobile, the design will shift to a single-column view with a bottom nav or menu for categories. All components are designed to flow logically and adapt; for instance, on mobile the category list might become a fixed bottom tab bar with icons for quick access, and the build summary might appear above or below the part selection UI as needed. The layout ensures that at any given time, the user has context of their build (e.g. a summary bar) while being able to dive into adding parts.

In summary, AquaBuilder’s UI aims for a polished, production-ready feel: visually rich with its aquatic theme, yet not at the expense of clarity. The use of modern design trends (dark mode, glassmorphism, micro-animations) combined with intuitive layout and iconography will make the app inviting for newcomers and satisfying for power users.

Data Models and Application State

Under the hood, AquaBuilder uses structured data models to represent all the elements of an aquarium build. These models define the attributes and constraints that feed into the compatibility logic. All data is typed (as interfaces or TypeScript types) to ensure consistency:

Tank Model: Represents aquarium tanks. Key fields include dimensions (length, width, height in inches) which let us calculate volume and floor area, the shape (rectangular, cube, bow-front, etc.), and whether it’s rimless or has accessories like a lid or stand. We also store material (glass/acrylic) and volume both in gallons and liters for user preference. Price and links (image and product URL) are included since users might be interested in purchasing. The tank is central since it defines the physical limits (size/volume) for the build – e.g. a 20-gallon rectangular tank sets the stage for how many fish can be housed and what equipment capacity is needed.

Fish Model: Each fish species entry contains comprehensive data about its requirements and behavior:

Basic info: commonName, scientificName, and taxonomy like family, category (freshwater, saltwater, brackish), plus a finer subcategory (e.g. tetra, cichlid, livebearer).

Size & Tank Needs: adultSizeInches (average adult length), and minimumTankGallons which is a general guideline for one fish of that species (often related to size and activity level). swimmingLevel (top, middle, bottom, or all levels) indicates where in the tank the fish typically spends time – useful for distribution and for the stocking visualizer to avoid crowding one zone
aquariumstoredepot.com
.

Water Parameters: Acceptable range for temperature (tempMin–tempMax in °F), pH (phMin–phMax), and hardness (hardnessMin–hardnessMax in dGH). These define that species’ environmental comfort zone.

Behavior & Compatibility: temperament (peaceful, semi-aggressive, aggressive) provides a quick gauge of how the fish typically behaves. There are fields for social needs: schoolingSize indicates the minimum group size (e.g. many tetras need 6+ to feel secure)
aquariumcoop.com
, with 1 meaning a solitary or non-schooling fish. territorialRadius in inches indicates how much space around its territory a fish will defend – a value >0 means it’s territorial (common in cichlids, for instance). Compatibility lists like incompatibleWith allow specifying known conflicts either by species ID or broader category (for instance, a goldfish might list tropical community fish as incompatible due to temperature and temperament differences). predatorOf and preyTo arrays list species that this fish will prey on, or be preyed upon by – ensuring the app can flag predator-prey combinations (e.g. angelfish and neon tetras: adult angelfish can eat bite-sized tetras
aquariumcoop.com
). Flags like nipsAtFins and incompatibleWithLongFinned capture behaviors like fin-nipping (e.g. tiger barbs are known fin nippers, so they shouldn’t be kept with slow, long-finned fish like bettas).

Care and Misc: careLevel (beginner to expert) indicates how hard the fish is to keep, diet (carnivore, herbivore, omnivore) could later be used to ensure a balanced feeding plan, and any specialNeeds (like extra oxygenation, specific caves for breeding, etc.) can be noted. Price, availability (common/rare/seasonal) and an image are included for completeness.

Plant Model: Each aquarium plant entry details its growth needs:

Classification: category (stem, moss, floating, carpeting, etc.) and common/scientific names.

Light & CO₂: lightRequirement (low/med/high/very-high) describes how much light the plant needs. If co2Required is true, the plant cannot thrive without CO₂ injection; if co2Recommended is true, it will survive in low-tech tanks but really flourishes with CO₂. High-light plants often do best with CO₂ supplementation
ukaps.org
 – the app will warn users if such plants are added without a CO₂ system.

Substrate & Water: The substrate field notes if the plant needs special substrate (e.g. “nutrient-rich” for heavy root feeders like Amazon swords, vs. just “any” or specific types like sand/gravel). The waterParams cover acceptable temp and pH range for the plant (most plants tolerate a range, but e.g. some might not like very hard water).

Growth: growthRate (slow/medium/fast), maxHeightInches, and placement (foreground, midground, background, floating) help the user understand how the plant will fit in the aquascape. spreadType indicates how the plant propagates (runners, rhizome splits, etc.), which might matter for maintenance.

Compatibility: incompatibleWithFish lists any fish that notoriously destroy or eat this plant. For example, certain cichlids and goldfish uproot or nibble plants; if those fish are in the build, the app can warn the user that a plastic or hardy plant might be better. Fields like providesHiding and providesShade indicate the plant’s benefits in the habitat (these could be used to suggest that adding such a plant would help nervous fish or reduce algae by shading, etc.).

Equipment Model: There are various categories of equipment each with unique specs, but common fields include name, brand, powerWatts (if applicable), price, and images/links. The category field distinguishes types like:

Filter: key specs might be flowRateGPH and filterType (HOB, canister, sponge, etc.), plus a list of mediaIncluded if any. The filter also has minTankGallons and maxTankGallons to indicate the recommended tank size range it can handle. AquaBuilder’s engine uses these to check if the filter provides roughly 4-10x turnover of tank volume per hour (a common rule of thumb) – for example a 30-gallon tank ideally wants ~120–300 GPH flow
liveaquaria.com
.

Heater: typically specified by wattage and whether it’s adjustable. Heaters also list a capacity range (min/max gallons). The general guideline is about 2.5–5 watts per gallon
thesprucepets.com
, so if a user picks a heater underpowered for their tank size, the app will flag it.

Light: important specs include lumens, kelvin or spectrum details (e.g. full-spectrum, plant-growth, actinic for corals), PAR rating if known (especially for plant lights), whether it’s dimmable or programmable (many modern LED fixtures have timers, sunrise/sunset effects), and the lengthInches to ensure it fits the tank. Lights also have tank size recommendations, particularly for intensity: e.g. a high-end plant light might handle up to a 24-inch deep tank with high-light plants.

CO₂ system: indicated by co2Type (pressurized vs DIY or liquid carbon), and whether essential components like a regulator or diffuser are included. This helps beginners know if they need additional parts.

Others: Air pumps might list flow rate or number of outlets, protein skimmers (for saltwater) have a rating for tank volume, UV sterilizers list wattage, etc. All equipment types use the minTankGallons/maxTankGallons fields so AquaBuilder can warn if, say, a filter is too weak or a skimmer is oversized.

Substrate Model: Describes aquarium substrates (gravel, sand, soil, etc.). Key properties:

type: broad category (e.g. “aqua-soil” for planted tank soils, versus inert sand).

nutrientRich: boolean if it’s a planted tank soil that contains nutrients.

buffersPH: boolean and buffersTo value if the substrate alters pH (for instance, crushed coral sand buffers to ~8.0 pH for African cichlids).

grainSizeMM gives an idea of the texture (fine sand vs coarse gravel).

color for aesthetic choice.

Compatibility flags like safeForBottomDwellers (important for soft-bellied fish like corydoras which can be injured by sharp gravel), safeForPlants (e.g. some gravel might not support plant roots well, while aqua-soils are ideal), and safeForBurrowers (loaches or eels that like to dig need soft sand).

For planning, we also include poundsPerGallon recommendation (how many pounds of this substrate per gallon for a typical 2-inch bed) and packaging info (bagSizePounds and price per pound). This allows AquaBuilder to calculate how many bags the user should buy for their tank size.

Invertebrate Model: Covers snails, shrimp, crabs, etc. Fields include category (shrimp, snail, crab, coral, etc.), and water parameter ranges similar to fish (temp, pH). Unique fields:

copperSensitive: since many inverts (especially shrimp, snails) are very sensitive to copper in water or meds.

Compatibility: incompatibleWithFish lists fish that typically eat or harass this invert (for example, many loaches eat snails, larger fish might eat shrimp). predatorOf and preyTo similarly to fish indicate food chain relationships (e.g. a crab might prey on small fish or shrimp; a shrimp might be prey to many fish).

Behavior: bioload (minimal/low/medium) to roughly quantify how much waste they add (most inverts are low bioload except perhaps large ones like lobsters). algaeEater flag if it helps with algae control (many snails and some shrimp eat algae). plantSafe indicates if the invert tends to eat/destroy plants (some crayfish will uproot plants, for instance).

Care level and price, image etc., similar to fish.

All these models feed into the central Application State represented by an AquariumBuild interface. An AquariumBuild holds:

A unique id and a user-defined name for saved builds, plus timestamps.

One selected tank (or null if none chosen yet).

Livestock arrays for fish and invertebrates, where each entry pairs an item (the Fish or Invertebrate object) with a quantity. This allows multiple of the same species to be added.

A plants array of plant items with quantities.

An equipment object grouping chosen equipment: it has specific slots for one filter, heater, light, co2, airPump, etc., and an other list for miscellaneous gear (like thermometer, test kit, feeder, etc. which are mostly optional extras).

A substrate field to hold the chosen substrate and how many pounds are calculated as needed for the tank footprint.

Additionally, the build state stores computed values that are derived whenever the user makes changes:

targetParams: This is the current target water parameter ranges (temperature, pH, hardness) that the user’s build should maintain, based on the overlap of all inhabitants’ needs. AquaBuilder can compute the intersection of all species’ acceptable ranges – if the ranges don’t overlap at all, that’s a serious compatibility problem (e.g. trying to mix an acid-loving fish with an alkaline-loving fish)
aquariumstoredepot.com
. If they do overlap, the overlapping segment is the ideal range for the tank. For example, if one fish needs pH 6.0–7.5 and another needs 7.0–8.0, the overlap is pH ~7.0–7.5, which is what the app would show as the target. The UI’s parameter visualizer (discussed later) will depict this.

compatibility: A CompatibilityReport object containing an overall status (compatible, or if there are warnings/errors) and lists of issues, warnings, and suggestions (each an array of CompatibilityIssue entries). Each issue has a severity (error, warning, info), a category (e.g. temperature, aggression, space, etc.), a title/description explaining the problem, and references to affectedItems (IDs or names of the fish/plant/equipment involved) and possibly a suggested action. This report is continuously updated by the rules engine whenever the build state changes.

Totals like totalPrice (sum of prices of all items * quantities), totalBioload (a custom metric combining fish waste production – we might compute this based on fish size and bioload factor), and stockingLevel (an estimated percentage of how “full” the tank is, where 100% is a comfortably stocked tank and >100% means overstocked). The stockingLevel is calculated by a function that sums up fish lengths but then adjusts for various factors (detailed below) – much like AqAdvisor does with bioload
aqadvisor.com
aqadvisor.com
.

State Management & Persistence: Given the complexity, the application state can be managed with either React Context + useReducer (to handle actions like “add fish”/“remove plant”/“update quantity” and recalc compatibility) or a dedicated state library like Zustand for a more straightforward store. In a Next.js app, this state would likely reside on the client side (especially since this is an interactive build tool) and be persisted to localStorage for logged-out users so their progress isn’t lost. If the user logs in or wants cloud saving, builds could also be saved to a database, but localStorage ensures quick save/load without needing an account. AquaBuilder will also support generating a shareable URL (for example, via query parameters or a unique build ID in the path) that encodes the build selections, so users can share their setups with others who can load it read-only or import it into their own workspace.

Compatibility Rules Engine

At the heart of AquaBuilder is the compatibility rules engine – a collection of algorithms and checks that continuously evaluate the current build. Every time the user adds or removes a species or changes equipment, these rules run to update the CompatibilityReport. The engine covers multiple domains of compatibility:

Water Parameter Overlap: For a community tank to thrive, all species should share a reasonable overlap in acceptable water conditions
aquariumstoredepot.com
. The app computes the intersection of all selected fish and invertebrate temperature ranges, pH ranges, and hardness ranges (plants are included for temperature and pH, though plants are often more tolerant except for extremes).

If no overlap exists in any one parameter, it’s flagged as an incompatibility error. For example, if you tried to mix an African Rift Lake cichlid (prefers hard, alkaline water ~pH 8) with a neon tetra (prefers soft, acidic ~pH 6), there is effectively no pH overlap – the app would mark this as “Incompatible: Water chemistry requirements conflict”
aquariumstoredepot.com
. In practice, many fish can adapt a bit outside their ideal range, especially captive-bred ones, but AquaBuilder will use the provided ranges as strict bounds.

If an overlap exists but is very narrow or at extremes, the engine issues a warning. For instance, if one species tolerates 72–78°F and another 78–82°F, the only overlap is exactly around 78°F. The app might warn “Temperature range overlap is narrow (~78°F); careful monitoring required.” Similarly, if all species overlap only at a high pH like 7.8 (which is borderline for some), it could warn that maintaining that exact parameter is critical.

The engine also picks a target value or range for the user. For example, if temp overlaps between 74–78°F, it might suggest “Aim for 76°F as a happy medium.” This gets displayed in the water parameters visualizer component. Maintaining stable, appropriate water parameters is crucial; the app encourages the user to choose fish with broadly compatible needs so the overlap isn’t razor-thin. (If the user insists on out-of-range combinations, the app can suggest considering separate tanks or not mixing those species.)

Tank Size & Space Validation: The chosen tank sets physical limits. The engine checks:

Minimum Tank Requirements: Every fish has a minimum tank size recommendation; if any selected fish’s requirement exceeds the current tank’s volume, that’s an error (e.g. trying to put a fish that needs 50 gallons into a 20-gallon tank). Even if volumes are okay, fish that grow large relative to tank dimensions trigger warnings. For example, an adult angelfish grows tall – a 10-inch tall tank would be unsuitable even if gallons seem fine (some species need a certain tank height or length to swim properly
aqadvisor.com
). The app might incorporate a check for tank length vs. fish size: a common guideline is the tank length should be at least 4-5 times the length of the largest fish, especially for active swimmers.

Swimming Space & Territory: Using each fish’s swimmingLevel and territorialRadius, AquaBuilder ensures there’s enough room. If two bottom-dwelling territorial fish (like male cichlids) are added, the engine calculates if their territories would overlap given the tank’s footprint. If each needs a 12-inch radius and the tank is 24 inches long, two territories would clash – leading to an aggression warning or error. To resolve, the app might suggest a bigger tank or fewer territorial fish. The user is also warned if too many fish occupy the same zone: e.g. if all selected fish are bottom-dwellers, the bottom of the tank could be overcrowded even if midwater is empty
aquariumstoredepot.com
. “Consider adding fish that occupy different water levels” could be a suggestion.

Aquascape & Hiding Spots: Although harder to quantify, the engine could use plant decorations info (like how many hiding spots are provided by plants or caves) to advise on territory. For example, territorial or shy species fare better with ample cover. If territorial fish are present but the build lacks plants/decor, a suggestion might be “Add more hiding spots (plants, rocks) to break up sightlines and reduce aggression”
aquariumstoredepot.com
. (This is more of a suggestion than a strict rule.)

Stocking Level Calculator: The app estimates how “stocked” the tank is. It starts with the classic “one inch of fish per gallon” as a baseline rule
aquacadabra.com
 for small community fish, but then refines it for accuracy
aquacadabra.com
:

It sums the total adult inches of all fish in the tank (totalInches). Then it adjusts this number by a bioload factor for each species (e.g. a 6-inch slim bodied tetra is very different from a 6-inch heavy-bodied cichlid in waste production). This idea is taken from advanced calculators: one fish’s “inch” might count more if it’s messier or more active
aqadvisor.com
.

Activity Level & Body Shape: Active swimmers (like danios) or fish that occupy the whole tank should be given more space than sedentary fish. Also, slender fish (like eels) vs bulky fish (like goldfish) of the same length have different mass. The engine might multiply certain species’ inches by a factor if they are known heavy waste producers or very active (goldfish, plecos, etc.).

Filtration and Plants: If a strong filter is present or many live plants (which consume nitrates), the tank can safely handle a bit more bioload. Conversely, if filtration is minimal, the safe stocking level is lower. AquaBuilder can reflect this by adjusting the stocking percentage based on filter capacity vs. bioload.

Distribution & Oxygen: If many fish occupy the same layer, that layer’s carrying capacity might be a bottleneck (particularly surface area for oxygen exchange with top swimmers). The traditional surface area rule (x inches of fish per surface area) could complement volume-based rules. Our engine simplifies by ensuring a mix of top, mid, bottom dwellers so oxygen use and waste distribution is even.

The final stockingLevel is presented as a percentage. Under ~80% is conservative (low-risk for water quality issues), ~100% is near the recommended max, and >100% triggers an overstocking warning (or error if extreme). The app might display “Stocking 120% – overstocked! Reduce fish or increase tank size/filtration.” It educates the user that the “1 inch per gallon” is a rough guide that doesn’t account for fish mass, waste, or tank specifics
aquacadabra.com
. Our advanced calculation addresses these variables to give a safer guideline. (We can cite that one 2-inch fish produces exponentially more waste than two 1-inch fish
aquacadabra.com
, so simply counting inches can be misleading.)

Aggression and Compatibility Matrix: Not all fish get along, even if water parameters and space are fine. The engine cross-references species behaviors:

Temperament Mismatch: If an aggressive species is listed with peaceful species, a warning is generated. For instance, adding a semi-aggressive gourami in a tank with very peaceful small fish might be okay if space is ample, but adding a known fin-nipper (like a tiger barb) with a slow long-finned fish (like a betta) will raise a specific warning (“Fin-nipping risk: Tiger Barbs may nip long-finned tankmates”). The app uses the nipsAtFins and incompatibleWithLongFinned flags to catch these scenarios.

Predator/Prey Checks: The predatorOf lists are used to flag dangerous pairings. If any fish or invert has another species in its predator or prey list, the engine marks an Incompatibility (severity high). For example, if the user tries to add neon tetras and angelfish, the angelfish’s profile (as a predator) or the tetra’s profile (as prey) will indicate the issue – likely a warning like “Angelfish may eat Neon Tetras when fully grown”
reddit.com
aquariumcoop.com
. Even if not immediate, the risk is noted. Similarly, if a species is known to eat shrimp or snails, those combinations are flagged (e.g. “Clown loach will eat snails – incompatible”). The rule of thumb “if one fish can fit in another’s mouth, it will eventually get eaten” is applied
aquariumstoredepot.com
. AquaBuilder uses mouth size and fish size info to judge this too: large, wide-mouthed fish (oscar cichlids, for example) should not be kept with any fish small enough to swallow
aqadvisor.com
.

Intra-species Aggression: Some species cannot cohabit with their own kind (especially territorial males). The data model might list a maximumGroupSize or similar (e.g. male Bettas = 1 per tank). The engine will error if the user tries to add two male bettas to one build
aqadvisor.com
. Another example is if a species is okay in a group but only one male per group, etc., which can be complex but at least common cases are handled.

Territorial Conflicts: This overlaps with space, but specifically if two species are aggressive and occupy the same niche (e.g. two bottom-dwelling cichlids that both claim cave territories), even if the tank could physically fit them, it might be incompatible behaviorally. The engine might check if two territorial species both are marked with bottom or same level and then require either large tank or one species only. Aggression factors can also escalate when breeding; while we might not simulate breeding states, general advice can be given if known (e.g. “Cichlids may become very aggressive when spawning – ensure hiding spots”).

Schooling & Social Needs: This is a special compatibility concern – if a schooling fish is alone or too few, it will be stressed and may even become aggressive out of fear. The engine checks each fish’s schoolingSize. If the user has less than that number in the quantity, a warning appears: e.g. “Neon Tetras are schooling fish – groups of at least 6 recommended”
aquariumcoop.com
. This is displayed in the compatibility summary so the user knows to add more or reconsider that species. Conversely, some fish like certain cichlids might have a maximum group or need harems (1 male, multiple females). Our data didn’t explicitly include that, but we could have entries or use incompatibleWith to prevent multiple males. The engine would warn if the social structure is not ideal (for example, “One male Betta per tank – remove extra or expect fighting”).

Dietary Compatibility: While not as critical, the app notes if any fish have vastly different diet needs that could conflict. For instance, mixing strict herbivores with predatory carnivores isn’t a direct incompatibility, but feeding might be tricky. Or housing delicate feeders with aggressive eaters can starve one. The data’s diet and specialNeeds could trigger an info note like “Ensure specialized feeding: Oto catfish may not compete well with faster fish for food” (just an example). If any fish requires live food and others do not, mention that too.

The outcome of these checks is a curated list of compatibility issues. Each entry explains why a combination is problematic and often a suggestion to fix it (e.g. “Consider removing one of the species or upgrading to a larger tank” for territorial fights, or “Add at least 3 more corydoras to form a proper group” for schooling shortfalls).

Equipment Capacity & Setup: The engine validates that the chosen equipment is appropriate for the tank and livestock:

Filtration: It checks the filter’s maxTankGallons against the actual tank size. If the tank is larger, clearly the filter is undersized (error). Even if rated okay, we apply the flow rule: ideally 4–5x turnover per hour as a baseline
liveaquaria.com
. If a filter’s GPH is much lower (e.g. only 2x tank volume), a warning “Filter flow might be insufficient (recommend ~5x tank volume per hour)” is shown. Conversely, if flow is extremely high (10x+), the user is warned about strong currents (especially if delicate fish like a betta or baby fish are present that prefer gentle flow
liveaquaria.com
). The app might suggest adding a flow controller or sponge over the intake in such cases.

Heating: Using tank volume and heater wattage, the engine ensures enough heating power. For example, a 100W heater on a 75-gallon tank is under the ~5W/gal guideline
thesprucepets.com
 – warning “Heating may be inadequate (rule of thumb ~5W per gallon; need ~375W total for 75 gal)”. If multiple heaters are used (some people use two smaller heaters instead of one big), their combined wattage is considered. Also, if the user’s target temperature is very high (for certain tropical fish) or the environment is cold, the app can suggest using two heaters for redundancy and even heating
thesprucepets.com
thesprucepets.com
.

Lighting: The engine cross-checks selected plants’ lightRequirement with the chosen light. If the user has high-light plants (requiring bright lighting and often CO₂) but selected only a basic low-light LED, it will flag “Insufficient lighting for some plants: e.g. Dwarf Baby Tears need high light”. It might suggest upgrading to a stronger plant light. On the other hand, if no live plants are present, any light that fits is fine (the app might just suggest that live plants could be added given the light, as a positive suggestion). Also, if a light is shorter than the tank length or not intended for the tank type (say a marine reef light on a freshwater planted tank), it could warn of spectrum mismatch.

CO₂ System: If any plant in the build has co2Required = true and the user has not added a CO₂ equipment, the engine raises an error or strong warning: “CO₂ injection is required for certain plants (e.g. Glossostigma); please add a CO₂ system or remove those plants.” For plants that have co2Recommended, if no CO₂ is present the app will show a warning: “High-light plants will do better with CO₂ – consider adding a CO₂ kit to avoid algae issues”
ukaps.org
plantedtank.net
. Additionally, if the user has added a CO₂ system but no high-light plants, an informational note might say “CO₂ system present – not strictly necessary unless you plan on high-demand plants” (this could be helpful if a user thinks they need CO₂ for everything; though many enthusiasts might add CO₂ anyway for plant growth, the app’s role is advisory).

Other Gear: The app ensures no critical category is missing. If the user hasn’t added a filter or heater, those are normally essential for a typical tropical freshwater setup, so it might show a persistent warning “No filter selected – essential for tank health
aqueon.com
” or “No heater selected – ensure your room temperature is within the fish’s range or add a heater.” (In cold-water or certain setups a heater isn’t needed, so it could base this on the fish’s temperature needs.) If the user has saltwater fish/inverts, the app will suggest equipment like a protein skimmer or reef lights in the suggestions section, though it might not be mandatory to add via the rules (since some fish-only marine tanks run without skimmers). Similarly, for any equipment that exceeds its capacity (like a filter or light saying max 20 gal on a 30 gal tank), it’s flagged.

Plant & Substrate Compatibility: The engine examines whether the chosen substrate and plants are compatible with each other and the livestock:

If a plant’s required substrate type doesn’t match the selected substrate, a warning is shown. For example, if the user selects delicate root-feeding plants (say, Cryptocoryne or Amazon Sword which prefer nutrient-rich soil) but the substrate is just inert gravel, it will warn “Nutrient-rich substrate recommended for Plant X; current substrate may not support optimal growth.” Likewise, if the substrate is very coarse gravel and the user has chosen carpeting plants that need fine substrate, warn that they might not thrive.

If any fish in the tank is a known plant destroyer (the plant’s incompatibleWithFish or conversely the fish’s profile might mention it eats plants), that is flagged. For instance, adding a goldfish to a tank with fine leaf plants like cabomba will likely result in salad – the app could warn specifically: “Goldfish tend to uproot or eat live plants, especially soft, leafy ones like Plant Y.”
aquariumstoredepot.com
 This could fall under compatibility issues.

Burrowing Fish vs Substrate: If there are burrowing species (certain eels, digger cichlids, etc.) but the substrate is large sharp gravel, the app suggests a softer sand substrate for their health. Similarly, if bottom-dwelling fish with delicate barbels (like corydoras catfish) are present but substrate is rough, warn to consider sand or smooth substrate to prevent injury.

Lighting vs Plants: Already covered under equipment, but reiterated: if no plants are present, lighting isn’t a big compatibility issue (just aesthetic), but if plants are present, ensure lighting and CO₂ meet their needs.

Hiding Spots & Biological Balance: If the build has no plants or decor and includes species that benefit from cover (many fish do), AquaBuilder might suggest hardy plants or artificial caves to make fish feel secure. It could also remind that live plants help with water quality (consuming nitrates) which can offset some bioload.

Cycling & Biological Maturity: A very important aspect for new setups is the nitrogen cycle – new tanks need time to grow beneficial bacteria to handle fish waste
aqueon.com
. AquaBuilder will incorporate this knowledge:

If the build is marked as a new setup (perhaps when the user starts a build they can indicate experience level or if the tank is new), the compatibility report will include an info/warning about cycling. For example: “New Tank Warning: If this is a new aquarium, ensure you cycle the tank before adding sensitive fish. Start with hardy species or use ammonia cycling methods
aqueon.com
. Adding all fish at once can cause toxic ammonia spikes (‘New Tank Syndrome’)
aqueon.com
.”

The app can have a built-in cycling planner: for instance, based on the list of fish, it might suggest an order in which to add them over time. Perhaps under suggestions: “Stocking Order Recommendation: add 2-3 hardy fish (e.g. guppies) first, wait 2 weeks, then add the next batch, and save delicate species like Discus for last once the tank is established
aqueon.com
aqueon.com
.” It can also remind the user to test water parameters during cycling or use products to jump-start bacteria. While this isn’t a “compatibility” in the sense of species getting along, it’s compatibility with the tank’s maturity.

If the user’s fish list is large relative to tank size and all added at once, that could trigger a stronger warning like “Too many fish introduced at once in a new tank can overwhelm the biofilter – consider starting with a smaller group and expanding gradually over 6-8 weeks
aqueon.com
aqueon.com
.”

Maintenance Alerts: If the stocking or bioload is high, the engine might suggest a more rigorous maintenance schedule (e.g. “Heavily stocked tank – consider 50% weekly water changes and monitoring nitrates”). This ties into a future feature of a maintenance calculator.

All these rules combined give AquaBuilder a comprehensive view of the build’s status. The CompatibilityReport will often have a mix of positive confirmations (“All species share compatible water parameters and temperaments – good to go!”) and warnings/errors for the user to address. The user can click on the detailed report to see each issue categorized (water, aggression, equipment, etc.), each with a clear description and often an actionable suggestion to fix it. The driving principle is to educate the user – not just say “No, this is wrong,” but why it’s a concern and how to solve it. This way, AquaBuilder serves as a learning tool, encapsulating expert fishkeeping advice (much like charts and forum advice) into a real-time assistant
liveaquaria.com
.

(For reference, this approach is inspired by tools like AqAdvisor, which also cross-checks many attributes like size, pH, aggression, etc.
aqadvisor.com
aqadvisor.com
. AquaBuilder extends this with an even broader scope: plants, full equipment, and an intuitive UI to interpret the results.)

User Interface Components

The app’s interface is composed of several interactive components and sections, each designed for clarity and ease of use:

1. Header

The header sits at the top of the app and remains accessible as users navigate through different sections. It includes:

Logo: A stylish AquaBuilder logo (perhaps text or an icon of a fish/tank) with an animated water ripple effect. For example, on page load the logo could reveal with a ripple, or have an infinite subtle animation like water waves passing through text. This sets the mood and also serves as a home button (clicking it could return to the main dashboard).

Navigation Menu: Key pages like “My Builds”, “Browse Parts”, “Guides”, “Community” are linked here.

My Builds leads to a list of the user’s saved aquarium builds (see component 10 below).

Browse Parts might let users explore the entire catalog outside of a build context.

Guides could be articles or help (e.g. tutorials on cycling, aquascaping, species profiles).

Community could link to user-submitted builds or a forum for sharing tips.
These links help frame AquaBuilder not just as a one-off tool but as a platform/community hub for aquarium planning.

User Menu: On the right side of the header, there will be a user profile icon. If the user is not signed in, it might show options to Sign Up or Log In (for saving builds to cloud or participating in community features). If signed in, clicking it shows a dropdown with account options (Profile, My Builds, Logout, etc.). The header could also show a save status (like a cloud icon indicating if the current build changes are saved or pending save).

Dark/Light Mode Toggle: Although the primary design is dark mode (fits the theme), AquaBuilder will offer a light mode for accessibility. A toggle (perhaps a sun/moon icon from Lucide icons) in the header allows switching themes. The dark theme uses the blues/teals as described; the light theme might invert to lighter backgrounds with perhaps soft blues and grays for accents. All components are designed to work in both modes (Tailwind CSS classes can facilitate this with the dark: variant for styles).

Responsive Behavior: On small screens, the header may collapse the nav into a hamburger menu. The logo might shrink to an icon. The key is that navigation should remain reachable. Also, the header could be fixed at top on mobile, and the bottom of the screen might be used for other controls (like a fixed compatibility bar or add-button, etc., to optimize thumb reach).

2. Build Dashboard (Main View)

This is the primary workspace where users see an overview of their current build. It is essentially the “canvas” for the aquarium they are constructing. On a desktop layout, it might look like:

┌─────────────────────────────────────────────┬──────────────────────────────┐
│ [Tank Preview Image]                        │ Build Summary & Stats        │
│ (possibly a 3D or side-view of the tank,    │ ─────────────────────────    │
│ or a representative image of the tank model)│ Tank: Fluval Flex 32g        │
│                                             │ Dimensions: 32 x 15 x 15 in  │
│ Tank Name/Model, volume, dimensions         │ (or volume in L)             │
│                                             │ Fish: 23 (8 species) 🐟      │
│ ┌ Compatibility Status Widget ┐            │ Inverts: 5 (2 species) 🦐    │
│ │  ✓ Compatible (or ⚠️ Warnings) │            │ Plants: 12 🌿                  │
│ │  All checks passed or summary of issues │  │ Stocking: 78% (Moderate)     │
│ └──────────────────────────────┘            │ [██████████░░░░] bar graphic │
│                                             │ Temperature: 76°F (target)   │
│                                             │ pH: 7.0 (target)             │
│                                             │ Hardness: 8 dGH (target)     │
│                                             │ 💰 Total Cost: $847.32        │
│                                             │ ⚠️ 2 Warnings, ❌ 1 Issue     │
│                                             │ - Neon Tetras need group of 6+│
│                                             │ - Angelfish may prey on Neons│
│                                             │ - Filter flow below recommended│
│                                             │ [View Details] (button)      │
└─────────────────────────────────────────────┴──────────────────────────────┘


Tank Preview: A visual representation of the tank is shown. If the tank model has an imageUrl, we display it (this could be a product photo or a side illustration). Optionally, we could eventually show a simplified 3D mockup of the aquarium with fish icons inside, but initially a static image is fine. Overlaid on the image, or below it, key tank info is shown: name, size, maybe brand and shape. If the tank has distinctive features (like “Cube” or “Bow-front”), an icon or label could indicate that. This area anchors the build – reminding what base we’re building on.

Compatibility Status Widget: On or near the tank image, a small card or badge indicates overall compatibility status. For example:

If everything is good: a green checkmark icon with “All Compatible” or “No Issues Detected” text.

If there are warnings: a yellow exclamation icon “⚠️ Compatibility Warnings”.

If any severe issues: a red stop icon “❌ Incompatibilities!”.
This widget, when clicked, could scroll or jump the user to the detailed compatibility report (or toggle the visibility of the bottom alert bar). It’s basically a quick-glance indicator (similar to how PCPartPicker shows a red/green icon if your parts list has issues).

Build Summary Panel: This section lists the build’s key stats and totals:

Livestock count: Total number of fish (and distinct species count) and invertebrates. Using small icons (🐟, 🦐) makes it easy to parse. E.g. “Fish: 23 (8 species)” tells the user how many individual fish and of how many types. This helps ensure variety and count are clear.

Plants count: Number of plants added.

Stocking Level: Presented as a percentage with a progress bar. For example, “Stocking: 78%” and a horizontal bar graph below it. The bar can be colored (green if under ~90%, yellow if 90-100%, red if >100%). This gives a visual cue if you’re nearing capacity. The text might also say “Moderate” or “Overstocked” next to the percentage. The calculation behind this is from our stocking engine (inches + bioload factors).

Water Parameter Summary: Show the target ranges that the user will need to maintain. For instance, “Temperature: 74–78°F” or a single value if narrow, “pH: 6.8–7.2”, “Hardness: 5–12 dGH”. If the user has set a specific target in their tank settings (some advanced users might tweak heater to 76°F specifically), it can show that as well. These values come from the overlap calculations and serve as a quick check if those parameters are comfortable for the user to achieve. (We could allow editing them if, say, the user decides to center on one end of the range – but that’s an advanced feature).

Total Cost: A sum of prices of all items selected (fish price * quantity, plant price * quantity, equipment, etc.). Displayed with a currency symbol. If multiple currency support is needed, it could adapt, but likely USD by default. Maybe an icon of a coin or shopping cart accompanies it. This helps budget-conscious planning.

Issue Ticker: A short list of current warnings or errors (if any), probably just one-line summaries with an icon. For example:

“⚠️ Neon Tetras prefer groups of 6+”,

“⚠️ pH range is narrow (6.8–7.0) for your selection”,

“❌ Angelfish may eat Neon Tetras”.
We won’t list every minor thing here (to avoid clutter), just the key 2-3 issues. There’s a “[Details]” link or button that opens the full compatibility report (or scrolls to the bottom alert bar). This acts like a warning ticker tape to draw attention to important compatibility concerns in context.

The Build Dashboard is essentially the hub where the user monitors the outcome of their selections. It’s designed to quickly answer: “Is my build okay? Any problems? How full is my tank? What’s this going to cost?” at a glance. Everything is continuously updated as the user makes changes in other panels or modals.

3. Category Selection Panel

Usually on the left side (for desktop) or as a collapsible menu (on mobile), the category panel is how the user chooses parts to add to their build. It’s organized into an accordion or list of categories representing each part of the aquarium:

The categories (with icons) include: Tank, Fish, Invertebrates, Plants, Filtration (Filter), Heating (Heater), Lighting, CO₂ & Air, Substrate, Other Equipment. Each category panel, when expanded, shows its contents and controls:

Header Row: Each category row has an icon and name (e.g. “🐠 Fish”). It also displays a summary count of items currently added in that category (for instance, “Fish (23)” or “Lighting (1)” so the user can see at a glance what’s filled). If nothing is added yet, it might say “(none)” or just show the icon+name.

Expand/Collapse: Clicking the category toggles the expansion. Only one category might expand at a time to save space (accordion behavior), or multiple if the user wants to compare.

Contents When Expanded: Inside a category:

A list of items already in the build for that category. For instance, under Fish, you’d see each species added, possibly with a thumbnail image and quantity (e.g. “Neon Tetra x 10”, “Guppy x 5”). Each might have a small “...menu” or buttons to edit quantity or remove it. Under Equipment categories, it will show the selected item (since typically one filter or one heater). If none is selected yet, it might say “None selected” in that section.

A Quick-Add Search field: a small input box with placeholder “Search fish...” (auto-narrowed to that category’s items). The user can type part of a name and get suggestions in-line or in a dropdown. For example, typing “tetra” would show a few tetra species that can be clicked to add immediately. This quick search is for users who know what they want. It could also auto-complete or show a list as you type.

A “Browse All” or “+ Add [Category]” button: This triggers opening the full Parts Browser Modal (component 4) for that category. For example, under Plants category, “Browse All Plants” opens the modal with plant filters. Under Other Equipment, “Browse Equipment” might let you filter by all other gear categories.

Perhaps for categories like Tank or Filter where only one can be chosen, the UI might show the current selection and a “Change” button instead of adding multiples.

The category panel effectively guides the user logically through the build. They might start at the top with Tank (choose a tank first), then add Fish, then Inverts, then Plants, then equipment, etc. The order is suggestive of a typical planning process. We might even enforce starting with a tank (since volume is needed for other checks). If no tank is selected, the Fish/Plant lists could be disabled or show a tip “Select a tank first”.

Icons & Visuals: Each category has a distinct icon and perhaps a subtle color accent to distinguish sections. For example, Fish could be blue, Plants green, Equipment orange, etc. The icons help quickly identify the section in collapsed state (especially on mobile where maybe only icons show in a bottom nav). We will use Lucide React icons or custom SVGs for these (Lucide has generic icons we can repurpose, or we include custom ones in our asset library).

On mobile devices, this panel might not be a persistent sidebar. Instead, it could be accessible via a bottom navigation bar with icons (like a tab for fish, one for plants, etc., similar to an app). Tapping a tab could slide up that category's content as a panel. Alternatively, a single “Add Item” button could open a menu of categories to choose from (especially if screen space is limited). We ensure the design is flexible: for example, on a phone, the main dashboard might show the tank image and summary first, and an “Add Items” floating button opens the category list as a modal. On tablets, maybe a collapsible side drawer.

4. Parts Browser Modal

When the user wants to browse the full catalog of parts for a category (fish, plants, etc.), a full-screen modal (overlay) appears. This is the shopping-like interface where users can filter and pick items. It’s analogous to PCPartPicker’s “Add a component” dialog or an e-commerce category page.

Layout: The modal typically covers most of the screen (with perhaps a semi-transparent dark backdrop around it). It has a top bar with the category name and a close button (X). Inside, it is divided into two sections:

Left Sidebar (Filters): A column with filtering options relevant to the category.

For Fish, filters might include: Water type (Freshwater/Salt/Brackish), Subcategory (checkboxes for Tetra, Cichlid, etc.), Size range slider (by adult inches), Temperament (peaceful/aggressive toggles), Level (top/mid/bottom), Care level (beginner/intermediate etc.), and maybe parameters like acceptable temp or pH range (though those might be advanced filters). Also, an “Only show compatible with current build” toggle is extremely useful – if turned on, the list will hide species that outright conflict with something already in the tank (e.g. if you have all tropical freshwater fish selected, it might hide saltwater species, or if your temp is cool it hides truly incompatible ones). This dynamic filtering saves the user time and emphasizes compatibility (PCPartPicker does similar by hiding incompatible parts if you choose that option).

For Plants: filters such as Light requirement (multi-select or checkboxes: low/med/high), CO₂ required (yes/no), placement (foreground/background), difficulty (beginner/advanced), maybe size or growth rate.

For Equipment: since “Equipment” has subcategories, the first filter might be a category selector (Filter/Heater/Light/ etc.). Once chosen, relevant filters appear. E.g. for filters: type (canister/HOB), flow rate range, brand; for heaters: wattage range, adjustable yes/no, brand; for lights: length, wattage, features, etc. The user can also directly navigate to a subcategory (we might even split Equipment into multiple sections in the UI for simplicity).

Price Range Slider: Almost all categories can have a price slider filter to narrow by budget.

Brand Filter: For equipment especially, a list of brands with checkboxes (Fluval, Eheim, etc.) could be provided.

The filter sidebar might also include a search bar (to search within that category by name keywords).

Filters should update the results live (or on “Apply filters” button if we prefer). We’ll use React state to manage which filters are active and filter the data accordingly.

On mobile, this filter section may become a collapsible panel at top of the modal or a separate filter screen, since a sidebar might not fit well.

Main Gallery (Results Grid): The majority of the modal is a grid or list of Part Cards (see next component) representing each available item that meets the current filter criteria. Likely a responsive grid (e.g. 3 or 4 cards per row on desktop, 1 or 2 on mobile). There could be a toggle between grid view or list view; a grid is nice for visual browsing (especially for fish/plants where image matters), while a list might work better for equipment where specs text is important. But to keep design scope manageable, we can do a grid with card previews and rely on the detail modal for full specs.

At the top of this section, a Sort dropdown allows sorting the results by different attributes: e.g. Price, Name (A-Z), Popularity (if we track it), Care Level, or any relevant metric. For fish, maybe sorting by size or aggressiveness might be useful too. The default sort might be by popularity or alphabetically.

The results grid is scrollable within the modal. If the list is very long (say dozens of species), we might implement virtualized scrolling for performance (using a library like react-window), but with ~30 fish and 20 plants in sample data, simple scrolling is fine.

Each card will show a summary (image, name, key icons). If a particular item is currently incompatible with the build, the card might display a small red icon or overlay text like “⚠️” or gray it out (if using the “show all” view). If the user enabled “compatible only” filter, those would be hidden anyway. If an item has a minor warning (maybe a fish is only borderline compatible due to pH, etc.), we might show a yellow badge “Warning” on it. This helps users proactively avoid issues.

Clicking on a card’s “Add to Build” button will immediately add that item (or open a quantity selection if needed) and close the modal (or keep it open for adding multiple items). For fish and plants, likely we should prompt for quantity after clicking add – e.g. a little number picker pops up (“How many Neon Tetras? [1]”) with a default of 1, and after confirmation, it adds them. Alternatively, clicking could add one by default and the user can increment later. For equipment and tank (single-selection categories), clicking “Add” might directly swap the selection (or if one already existed, confirm replacement).

The Parts Browser is a critical component, as it’s where users explore what’s possible. It should be fast, informative, and user-friendly. By integrating compatibility filtering and clear info on each part, users are less likely to pick something that doesn’t work. It’s essentially the “catalog” view of our app’s database.

5. Part Card Component

This is a UI element representing a single item (fish, plant, etc.), used both in the results grid and possibly in summary lists. It provides a snapshot of the item’s key info and actions. The design of the card is generally:

┌───────────────────────────┐
│ [Image of Item]           │
│ (e.g. a thumbnail photo)   │
├───────────────────────────┤
│ **Neon Tetra**            │
│ _Paracheirodon innesi_    │
│                           │
│ 🌡️ 72–78°F   📏 1.5"      │
│ 😊 Peaceful  🏊 Middle    │
│ ⭐ Beginner               │
│                           │
│ $3.99 each                │
│                           │
│ [➕ Add]    [🔍 Details]   │
│                           │
│ ✅ Compatible (or ⚠️/❌)    │
└───────────────────────────┘


The image occupies the top portion, giving a visual. For fish, an attractive photo of the species; for equipment, maybe a product photo; for substrate, a sample image of the gravel; etc. The image helps quickly identify and also adds appeal.

Name and Scientific Name: The common name is prominent, with the scientific name in italic smaller text below it (for animals and plants). For equipment or substrate, just the product name and perhaps brand in smaller text.

Key Attributes Icons: A row (or two) of icons with brief data:

For fish: a thermometer icon 🌡️ with the fish’s temp range, a ruler 📏 with max size, a smiley or aggression icon 😊/😠 with temperament, a swimmer 🏊 icon with “Top/Mid/Bottom” (here “Middle” for mid-level swimmer). Also possibly a group of fish icon if it’s a schooling fish (but we have schooling size elsewhere).

For plants: perhaps a sun icon indicating light requirement (low/med/high), a CO₂ icon if needed, thermometer for temp range if notable, maybe a drop icon for pH range if extreme, etc.

For equipment: for filter, a flow icon with GPH, for heater, a thermostat icon with wattage and “for X–Y gallons”, for lights, a bulb icon with length and maybe lumens.

We can’t show everything on a small card, just the highlights that most influence choice.

A star ⭐ or similar icon can denote Care Level (like Beginner, Intermediate). Alternatively, use text “Beginner” as in the example. Or we could use a 1-4 scale of stars to visualize difficulty, but textual is clearer.

Price: The price per unit. For fish/plants sold individually, show per each (maybe also if there’s a minimum school suggestion, but price likely each). For equipment, full item price. If multiple vendors were a feature, we might show a range or a starting price.

Add/Details Buttons: Two primary actions –

Add to Build (a button possibly styled with a plus sign or cart icon). Clicking it triggers adding the item. This might immediately add (and in fish case, perhaps prompt quantity).

Details (a subtle button or even just clicking the card anywhere could open details). The “Details” button (with a magnifying glass or info icon) opens the Part Detail Modal (component 6).
These buttons are designed to be easily tappable. On mobile, they might be bigger or maybe the card is clickable with a context menu.

Compatibility Indicator: At the bottom or bottom-right of the card, we display a status icon for compatibility given the current build context:

✔️ (green check) “Compatible” if adding this item poses no issues with what’s already selected.

⚠️ (yellow exclamation) “Warning” if it would introduce a warning (for example, it’s technically okay but narrow parameter range or it’s a schooling fish and you might need several, etc.).

❌ (red cross) “Incompatible” if this item flat-out cannot coexist with something in the build (e.g. a saltwater fish when the tank is freshwater, or a predator of an existing pet).
If “Only compatible” filter is on, you wouldn’t see the incompatible ones at all, but if it’s off, this indicator helps explain why something might be a bad pick.
This feature dramatically helps the user to not accidentally add problematic choices – they can see at a glance which items are safe.

The style of the card is consistent with the dark theme: a dark card background with slight transparency (so maybe we see a hint of the water animation behind if using glassmorphism), light text, and a slight hover highlight (glow or raising effect). Cards likely have a small shadow or border to stand out from the background.

6. Part Detail Modal

When more information is needed about a specific item, the user can open a detail view. This could be either a dedicated page or (more likely in a single-page app) a modal overlay similar to the browser, but focusing on one item. For example, clicking “Details” on Neon Tetra opens a panel with comprehensive info:

Content in Detail Modal:

Image Gallery: A large display of images, possibly with a carousel if multiple images are available. For fish, one might be a close-up, another showing a school of them, etc. The user can click through images or thumbnails. This gives a better look at the item than the small card image.

Basic Info: The name (common & scientific), and perhaps taxonomy or category labels (e.g., “Freshwater – Tetra family”). Maybe tags for “peaceful”, “community fish” etc., at a glance.

Specifications: A section listing all relevant data in a structured way:

For fish: Adult size, diet, temperament, swimming level, minimum tank size, native region (if we have it), etc. Water parameters range listed clearly (perhaps a line: “Temperature: 72–78°F, pH: 6.0–7.5, Hardness: 3–12 dGH”). If it’s a schooling fish, note “Needs group of at least 6”. If it’s territorial, note that. Basically a bullet list or table of key stats.

For plants: Light required, CO₂ required/recommended, growth rate, max size, placement (foreground/background), suitable substrate, etc. Water temp and pH range. Care difficulty and pruning frequency if relevant.

For equipment: All the specs from the model (dimensions, capacities, power consumption, any special features).

Water Parameter Compatibility Chart: A nice feature is a small visual graph or bar showing where this item lies in terms of acceptable temp/pH relative to the current build’s target. For instance, a horizontal bar for temperature with the fish’s range highlighted, and an indicator for the build’s current planned range or tank setting. If the fish’s range doesn’t overlap with current tank settings, it would show visually in red. If overlapping, show green. This way, even before adding, the user can see if it fits their tank’s environment (assuming a tank is picked). If no tank or other context yet, we can just show its range graphically with a thermometer and pH scale image.

Compatibility Notes: If the species has specific compatibility notes (like “Don’t keep with large cichlids” or “Can cohabit with shrimp safely”), those are shown here. We can generate or store a short paragraph of compatibility tips per species. For example, “Neon tetras are peaceful community fish that do well with other small peaceful species. Avoid housing them with much larger fish that could see them as prey
reddit.com
. They prefer to be in schools to feel secure.”

Care Guide Summary: A paragraph or two summarizing how to care for the item:

For fish: notes on ideal tank setup (e.g. “Planted tank with gentle flow, dim lighting replicates their natural habitat”), feeding recommendations, any special behaviors (like if they’re sensitive to certain medications or need pristine water).

For plants: care tips (planting method, fertilization, how to propagate).

For equipment: maybe installation or maintenance tips (e.g. “Rinse filter media monthly”).
We don’t have full articles for each, but a concise summary from our knowledge base or external guides could be provided.

Price & Vendor Info: If we integrate e-commerce, here we might list where to buy: e.g. “Available at: PetCo $3.99, AquariumFish.net $2.50 (out of stock)” – possibly with links. At minimum, display the price we have and maybe the brand or product URL (with a button “View on Store” that opens the productUrl in a new tab).

Related Items / Suggestions: At the bottom, show some related content to keep user engaged:

For a fish detail, “Similar species you might consider” (e.g. if viewing Neon Tetra, suggest Cardinal Tetra, Ember Tetra, or other small community fish).

Or “Compatible tank mates” suggestions: a slider or list of species that generally get along with this fish, to encourage complementary additions. This can be derived from our compatibility data (e.g. peaceful mid-level tetra – we can suggest peaceful bottom cleaners like corydoras, or top-dwellers like hatchetfish).

For a plant, suggest similar level plants or ones that pair well (tall background plants if this is a foreground carpet).

For equipment, suggest other gear (like if looking at a filter, maybe suggest a heater and light that are popular for the same tank size).

Action Buttons: Prominently an “Add to Build” button here as well (so user can add from the detail view after reading about it), and maybe +/- to adjust quantity if relevant. Also a close button to exit the modal.

The detail modal essentially acts as an in-app encyclopedia entry for the item, ensuring that even novices can read why a certain fish might not be good for them or how to care for it if they choose it. It’s a chance to provide depth of info which the main UI cards can’t due to space. It also reinforces trust in the app’s recommendations by showing the rationale (sources, data) behind them.

7. Compatibility Alert Bar

This is a persistent bar usually fixed at the bottom of the viewport, summarizing the compatibility status and alerts. It serves to catch the user’s attention if there are unresolved issues in the build. The design is typically a full-width bar with a contrasting background (perhaps a slightly brighter/darker tone than the rest of UI to stand out):

┌──────────────────────────────────────────────⚠️  2 Warnings   ❌  1 Incompatibility──────────────────────────────────────────────┐  
│ Angelfish may eat Neon Tetras when fully grown. Resolve by separating or choosing different tank mates. [Details]           │  
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


The bar might begin with icons and counts: e.g. a warning triangle and the number of warnings, a red cross and number of errors. Clicking those or the bar could expand a panel that lists all issues in detail (if not already expanded).

A short description of the highest-severity issue is usually shown next to the icons. For example, if there is 1 incompatibility, it might print that description directly: “Angelfish may eat Neon Tetras when fully grown”. If multiple, it could cycle through them or just say “Multiple issues. Click [Details] for full report.”

A Details button or link on the right side invites the user to open the full compatibility report modal/page. Alternatively, the bar itself can be clickable to open the detailed list (like how cookie notices or error toasts work).

The bar uses color coding: if any error present, it likely has a red tint; if only warnings (no errors) maybe a yellow tint. If all compatible, the bar might either not show at all or show a small green “All systems go” message. Possibly, we hide the bar entirely if no issues, to avoid unnecessary screen usage – instead the Compatibility Status Widget (in the build summary) indicates all clear.

When expanded (if we allow it to expand in place), it could grow upward showing a list of CompatibilityIssue items, each possibly with:

an icon (❌ or ⚠️ or ℹ️),

a short title (e.g. “Predation Risk”),

a description (“Angelfish can prey on small tetras in the same tank”),

affected items listed (“Affected: Angelfish, Neon Tetra”),

and maybe a suggested solution (“Suggestion: Choose larger tankmates or avoid mixing these species.”).

This comprehensive report could also be a separate modal if not comfortable in a bar. But having at least the bar always visible means the user is always aware if something needs their attention, no matter which part of the UI they are interacting with.

8. Water Parameters Visualizer

This is a specialized component (likely part of the compatibility details or the main summary) that provides an interactive chart for water parameters. Its goal is to visually communicate where each species’ comfort ranges overlap and what the target ranges are:

It can appear as a section in the compatibility report or possibly at the bottom of the build summary card. It would have separate lines for each parameter: Temperature, pH, Hardness.

For each parameter, a horizontal bar (like a slider) shows a broad possible range (e.g. for freshwater fish, maybe we consider 60°F to 90°F as the full span on the chart). Then a highlighted segment indicates the safe overlap range for the current selection. We might use a colored band (green for the overlap, red on parts that are outside someone’s range). Each species could also be represented by a colored line or marker on this chart:

E.g. Temperature: a fish that likes 72–78 might be a blue line spanning that interval, another fish 75–82 a green line, etc. The overlap (say 75–78) is highlighted. If any fish’s range doesn’t intersect, that fish’s line will sit apart (maybe blinking or in red).

pH similarly, maybe from 5 to 9 scale, with each fish having a band. Overlap might be, say, 6.8–7.2 in green.

There could be a vertical marker showing the currently set “target” value (if the user or app chooses one). For instance, if the overlap for temp is 74–80, maybe the user set heater to 78, so a marker at 78°F.

The user could potentially adjust the target by dragging the marker – e.g. set desired temperature – and the app could recalc if that goes out of any species range. But likely, target is just auto-chosen and static unless the user explicitly overrides it.

This visualizer helps users quickly see the compatibility. It’s one thing to say “range overlap is 6.8 to 7.0 pH”, but seeing a narrow sliver on a bar emphasizes how tight that is (hence why the app might warn).

Additionally, if the user toggles between freshwater/brackish/salt (as a tank setting), this component can present preset ideal ranges or at least confirm the current build’s category. Possibly for saltwater, it might show salinity instead of hardness, etc. (Though our data models are mostly freshwater oriented in the spec, the design supports saltwater too).

This component is interactive in the sense of being visual, but it might not be heavily user-interactable except possibly adjusting a slider for heater/CO₂ if we wanted that level of simulation.

9. Stocking Level Visualizer

To complement the numeric stocking percentage, a more visual representation of how the fish occupy the tank can be useful and fun. This component could be an illustration of the tank (side view cross-section) showing little fish icons representing each species at their respective swimming levels, giving a sense of how crowded each area is.

The tank outline can be drawn to scale (roughly) based on the tank dimensions. Within it, icons for fish are placed: top-level swimmers near the surface, mid-level in the middle, bottom dwellers near the substrate. The number of icons per species could reflect the quantity (like a school of 10 tetras might show a cluster of 5-10 tiny fish silhouettes schooling in the mid region).

Territorial zones: If feasible, draw circles or territories for applicable fish. For instance, if a cichlid has a 6-inch radius territory, draw a shaded circle around its icon of that radius. Overlapping circles in red would indicate conflict. If the tank is too small, the circle might extend outside the tank boundaries, clearly showing it’s a problem. This makes abstract concepts like territory more concrete to the user.

Schooling indication: We could group schooling fish icons together with a bracket or simply by placing them together. If the group is below recommended size, perhaps color them differently or put a small warning icon next to them.

Bioload indicator: Perhaps the substrate could change color or an overlay if bioload is high (like water color tinted if too many fish). But that might be overkill; the stocking bar already covers that.

Interactivity: Hovering or clicking on an icon could highlight that species and show info (like name and count). This could tie into an interactive legend.

On mobile, this visual might be simplified or static due to small screen – maybe just an illustrative icon that changes fullness or something. On desktop, there’s more room to play with it.

This visualizer mainly helps users intuitively grasp “how many fish and where”. For example, if they added 4 species and all of them show up at the bottom and the top looks empty, they might realize “oh I should add some top swimmers to balance the tank”. Or if the image is so cluttered with fish icons that it’s visually crowded, that reinforces an overstocking warning. It’s a feature that can set AquaBuilder apart by not only crunching numbers but also showing a picture of the tank stocking.

10. Build List View

This is separate from the build editing interface; it’s accessible via “My Builds” in the header. It shows a dashboard of saved builds for the user, possibly with options to share or explore community builds (if not implementing community yet, at least personal builds).

Each saved build is presented as a thumbnail card. It might include a small image of the tank (perhaps the same tank preview image used in the build), overlaid with some info:

Build name (user-defined, e.g. “Discus Planted Tank”).

Key stats: volume of tank, number of fish/plants, stocking %.

Overall compatibility status (if it was saved with warnings, maybe an icon shows that).

Total cost at save time.

Possibly show the date created or last updated.

Actions on each build:

Open/Edit: clicking the card will open that build in the main editor interface to continue editing.

Clone: a button to duplicate the build (maybe to use as a template for variation).

Delete: remove the build (with a confirm prompt).

Share: clicking share could copy a link to clipboard or generate a shareable link (if builds are stored in a database, the link might be something like aquabuilder.com/build/12345 or a hash that anyone with link can view in a read-only mode). If not logged in, perhaps share could encode the build in JSON in the URL (but that could get long; a shorter approach might be needed).

There might also be a button “New Build” to start from scratch (especially if they want to have multiple projects going).

If a Community Builds feature is available, the Build List page might have tabs for “My Builds” and “Community Builds” or “Featured Builds”. Community builds could be curated or user-submitted ones that are public. Each would have similar cards with maybe the username of the creator and a rating or number of likes. Users could view them and then click “Clone to My Builds” to start their own copy. This fosters sharing of ideas (like someone can publish their successful “African Cichlid Rock Tank” setup and others can emulate it).

For now, focusing on personal builds is priority, but the design keeps community in mind.

With all components described, it’s clear AquaBuilder is a feature-rich application. The UI components work together to guide the user through building an aquarium, catching mistakes, and providing knowledge at every step.

Features to Implement

Bringing AquaBuilder to life involves implementing a suite of features. Below are the core features (must-haves for the initial release) and advanced features (nice-to-haves or future enhancements), along with notes on how they function:

Core Features

Build Creation & Management: Users can create a new aquarium build, give it a name, select a base tank, and then incrementally add parts. They can have multiple builds saved. This involves CRUD operations on builds (create, update, delete in local storage or database). The UI provides Save/Load functionality, and if logged in, syncing with their account. A “New Build” flow can prompt for basics (like choose freshwater vs saltwater, pick a tank size) to get started.

Real-time Compatibility Checking: As discussed, the compatibility engine runs on every change. This must be optimized (using memoization or selective checks) so that adding one fish doesn’t re-evaluate everything from scratch more than necessary. But in practice with our data sizes, it’s fine. The result of checks are immediately reflected in the UI (the status widget, warnings list, disabled incompatible options, etc.). This feature is the heart of AquaBuilder – making it feel like a smart, responsive assistant. It ensures a beginner adding an incompatible fish gets instant feedback to reconsider
liveaquaria.com
, instead of discovering problems weeks later.

Color-Coded Status Indicators: All lists and headers reflect status (e.g. a red highlight on the Fish category name if any fish-related issue exists, etc.). This consistent color coding across the app (green=good, yellow=caution, red=problem) lets the user quickly scan for trouble spots. We also ensure to include icons or text so it’s not color-only (for accessibility)
secretstache.com
.

Detailed Explanations: For each compatibility message, a user can expand to read a clear explanation. For instance, a warning “pH range is narrow” when expanded might say “Your Neon Tetra prefers pH 5.0–7.0 while your Guppy prefers 7.0–8.0. The only overlap is around pH 7.0, which is a small window. This means you’ll need to keep the pH very stable at ~7.0 to keep both species happy
aquariumcoop.com
.” Then it could suggest either choosing species with more overlap or being prepared for careful water adjustments. By providing reasoning (often sourced from known fish care knowledge), we enhance user learning.

Smart Suggestions: Beyond just warnings, the app will proactively suggest improvements:

If the user has fish that need higher oxygen (like hillstream loaches or many fish in a tank), it might suggest adding an air pump or live plants.

If the user adds a lot of plants and bright light, suggest “Consider adding a CO₂ system for optimal plant growth and algae prevention”
ukaps.org
.

If a user’s stock is all male livebearers, suggest “Add a few females or expect aggression – usually 2–3 females per male is recommended to diffuse attention.”

Or simpler: “Complete your setup: add a heater” if water is tropical but no heater yet.

These suggestions are shown in the CompatibilityReport (with severity ‘info’ perhaps) so they don’t alarm, but provide guidance. They help users refine their build to be not just minimally compatible but truly thriving.

Price Tracking: Every item has a price, so the app calculates:

Total price of the build, updating in real-time.

Per-category subtotal (maybe in the summary or an expandable list: e.g. Fish $30, Plants $25, Equipment $792, Substrate $50).

Price per fish or plant already shown on cards. Possibly, if user enters quantities, show “x10 = $39.90” in the fish list.

If the app could integrate multiple vendors, it might show a range or allow switching supplier to get best price. For now, assume one price per item.

This helps users stick to a budget and also realize how choices (like an expensive LED light or many rare fish) add up. It’s similar to PCPartPicker’s total that many use to budget PC builds.

Search & Filter: Implement powerful search on the parts database:

General search bar (maybe at top of app) to find any item by name quickly.

Filter functionality in the browse modal as described: e.g. multiple criteria like checkboxes and sliders that can be combined. This likely leverages array filter functions or a library for better search (Lunr.js or Elasticlunr for full-text, or we can manage with simple string matching for names).

“Compatible only” toggle is key: filtering items based on dynamic criteria (the current build’s context). We implement this by running each candidate item through a mini version of the compatibility check with the build (just checking if adding that item alone would break something). Performance might be a consideration if we do it for hundreds of items, but with limited data it’s fine. We can optimize by tagging each species with attributes (freshwater vs salt, etc.) and quickly eliminate obvious mismatches.

Debounce search inputs so that typing doesn’t cause laggy filtering (only filter after user stops typing for 300ms, for example).

Responsive & Mobile-Friendly Design: Ensure the layout components adapt to different screen sizes (Tailwind’s utility classes like md:flex or hidden lg:block will help show/hide or re-flow content). Use a mobile-first approach in CSS.

Likely use a drawer for category menu on mobile, and modals that take full screen for browsing parts or viewing details.

Use legible font sizes and hit areas (buttons not too small for finger tapping).

Test the layout at various breakpoints (e.g. 360px wide phone, 768px tablet, 1024px small laptop, 1440px desktop) to refine.

Advanced Features (Future Enhancements)

Build Wizard: A guided experience for beginners where AquaBuilder walks them through step by step:

Option 1: “Start with tank size” – user says e.g. 20 gallons, then the app suggests suitable fish (perhaps a wizard: pick a theme: community tank, species-only, etc., then suggest compatible options, etc.).

Option 2: “Start with a fish” – user picks a favorite fish (say “I want angelfish”), then the wizard suggests an appropriate tank size, and compatible tank mates, plants, etc., essentially building around that fish’s needs.

This is a more narrative approach and involves pre-defined templates or logic. It would greatly help novices who don’t even know what to consider first.

Also curated starter builds for common setups (e.g. “10-gallon beginner community”, “African Cichlid Rocky Habitat”, “High-Tech Planted Nano Tank”) could be offered as one-click templates.

Community Builds Gallery: As mentioned, a shared space where users can publish their builds. This requires backend support. But conceptually:

Users can mark a build as “Public” and write a description/story about it. It then appears in a gallery where others can browse by popularity or tags (like “planted”, “nano tank”, etc.).

Visitors can like or comment on builds, or load them to view compatibility (maybe in a read-only mode if not logged in).

This fosters exchange of ideas and showcases the capabilities of the app (like a social component).

Comparison View: A feature to compare items side-by-side:

e.g. Compare two fish species or two filters. Show their specs in two columns for easy decision making. PCPartPicker has this for part lists; we could allow selecting 2-3 items from the browse results and hitting “Compare” to open a modal with a comparison table.

Similarly, comparing entire builds – could be useful if someone wants to see differences between, say, two lighting options scenarios. But that might be overkill.

Cycling Planner: Taking the cycling suggestions further, an interactive timeline:

Based on when the build is “started”, generate a week-by-week guide for introducing fish. For example, mark Week 0-2: cycle the tank (with maybe hardy fish or just ammonia). Week 3: add first fish species (the hardiest one). Week 5: add next batch, etc. This could tie into the concept of a “stocking order”.

It could also remind when to do first water change, when to start testing water frequently, etc. A simple version might just be a textual guide. A more complex version might integrate with a calendar or send reminders.

Maintenance Calculator: Using the build data to estimate ongoing maintenance:

For example, “Estimated 15 minutes of weekly maintenance (water changes ~20%, filter cleaning monthly, plant trimming bi-weekly, etc.)” – based on factors like tank size (bigger tank = more water to change), number of fish (more waste = more frequent water change), plant growth rate (fast plants = more trimming), etc.

Possibly output a suggested water change schedule (like “20% weekly” or “50% every 2 weeks” depending on bioload and target nitrate accumulation)
aqueon.com
aqueon.com
.

Feeding schedule: If the build has carnivores vs herbivores, the app could say “Feed protein (brine shrimp, etc.) 3x a week, vegetable matter 2x a week for this mix” or “All fish can be fed once daily with quality flake, with occasional treats”.

These are more advisory but rounds out the “planning” to include care, not just buying equipment.

The architecture is prepared to incorporate these as it already tracks relevant data (bioload, schedules, etc.).

Sample Data

To make AquaBuilder realistic and helpful out-of-the-box, we include a rich set of sample data covering a broad range of common aquarium items. Here’s a breakdown of what our initial dataset will include (the prompt suggests at least these, and we might have even more for diversity):

Fish (30+ species): We’ll include popular representatives from major groups:

Tetras: e.g. Neon Tetra, Cardinal Tetra, Ember Tetra, Rummy-nose Tetra, Black Skirt Tetra. (Tetras are small, schooling, peaceful – good for community tanks.)

Livebearers: Guppy (multiple color morphs), Molly, Platy, Swordtail, Endler’s Livebearer. (These are hardy, good for beginners, and livebearers breed readily – note ratio of genders in compatibility.)

Cichlids: German Blue Ram (small peaceful cichlid), Angelfish (medium semi-aggressive cichlid), Discus (large, sensitive cichlid), Apistogramma (dwarf cichlids), perhaps a Malawi Mbuna (African cichlid) for an example of aggressive/hard water fish. (Cichlids are diverse – include both community-type and aggressive ones.)

Catfish: Corydoras (Panda Cory, Bronze Cory, Julii Cory – small bottom shoalers), Otocinclus (algae-eating dwarf catfish), Bristlenose Pleco (manageable pleco, algae eater). Maybe also a larger catfish like Pictus or Raphael to illustrate not everything fits small tanks.

Rasboras: e.g. Harlequin Rasbora, Chili Rasbora, Galaxy Rasbora (Celestial Pearl Danio – often classified with rasboras).

Bettas: Siamese Fighting Fish (Betta splendens) – with note that males are aggressive to each other and sometimes to others. (Compatibility engine will treat this specially – one male betta only, caution with fin nippers.)

Gouramis: Dwarf Gourami, Pearl Gourami, Honey Gourami – medium top-dwelling, some can be territorial. Good to show semi-aggression and need for space.

Loaches: Kuhli Loach (eel-like burrower, peaceful), Clown Loach (larger, eats snails, schooling), Hillstream Loach (cool water, high flow requirement – special case).

Danios: Zebra Danio (hardy top swimmer, good for beginners), and Celestial Pearl Danio (which is actually the Galaxy Rasbora already listed).

Barbs: Cherry Barb (peaceful mid-level), Tiger Barb (fin-nipper, semi-aggressive).

“Oddballs”: Maybe one or two like a Dwarf Puffer (to show special diet and aggression) or an African Dwarf Frog (though not a fish, sometimes kept similarly).

Each fish entry will have realistic parameter ranges (from sources or common knowledge), temperaments, etc., as per the model. For example, Neon Tetra: temp 70-81°F, pH 5.5-7.5, peaceful, schooling 6+, adult size 1.5”, etc. Angelfish: temp ~75-82°F, pH 6.5-7.5, semi-aggressive, adult size 6” (plus height), minimum tank ~30 gal tall, may prey on very small fish, etc.

This range of species will allow users to attempt many common community setups or even species tanks.

Plants (20+ species):

Beginner-friendly: Java Fern (low light, attaches to wood), Anubias (low light, hardy), Amazon Sword (moderate light, heavy root feeder), Java Moss (low light, good for breeding), Cryptocoryne (many species, low-medium light, slow growing), Marimo Moss Ball.

Intermediate: Ludwigia (medium light stem), Rotala (medium-high light stem), Vallisneria (tall grass, medium light, propagates runners), Dwarf Sagittaria (low-mid light carpeting), Hygrophila (fast-growing stem).

Advanced: Dwarf Baby Tears (very high light, CO₂ carpet), Glossostigma (high light carpet), Monte Carlo (medium-high light carpet, maybe easier than HC), Red Cabomba or other demanding red plant (for high light, CO₂), Bucephalandra (slow grower but needs stable CO₂ for best color).

Floating: Duckweed (fast multiplying, low light), Water Lettuce or Frogbit, Salvinia.

Epiphytes: (besides Java Fern/Anubias) maybe Bucephalandra as mentioned, or Bolbitis (African fern).

Each plant entry will specify if CO₂ is needed. For example, Java Fern: low light, no CO₂ needed; Dwarf Hairgrass: high light, CO₂ recommended to carpet; etc.

Substrate preferences: e.g. Amazon Sword would have substrate “nutrient-rich” recommended, while Java Moss “any” since it doesn’t root.

Provide heights: e.g. Amazon Sword up to 20”, so should be background for big tanks; Dwarf Baby Tears 1-2” carpet.

Equipment: (We’ll have at least a handful in each major category with a range of sizes)

Filters:

Hang-on-Back (HOB): e.g. AquaClear 50 (for up to 50 gal, 200 GPH), Seachem Tidal 75, etc.

Canister: Fluval 207 (up to ~45 gal), Fluval FX4 (up to 250 gal, high flow), Eheim Classic 250, etc.

Sponge Filter: a generic one for small tanks (good bio, low flow for shrimp fry).

Internal Filter: maybe a small filter for nano tank.

We’ll include the flow rates and tank ratings in each.

Heaters:

Fluval E Series 100W, Eheim Jäger 200W, Aqueon 50W, etc. For various sizes (like 50W for up to 10 gal, 100W for 20-30 gal, 200W for 50 gal, 300W for 75+ gal). Mark adjustable = yes for most modern heaters.

Lights:

Fluval Plant 3.0 (a high-end programmable LED for planted tanks, various lengths like a 24” and 48” version).

Finnex Stingray or Finnex 24/7 (good plant lights mid-range).

Nicrew LED (budget light).

Perhaps a generic “reef light” for saltwater to cover actinic spectrum (for coral scenario).

Include lumens/PAR if possible. E.g. Fluval Plant 3.0 36” has high lumens and is “high” light for a 20” tall tank.

If possible, tag which ones are suited for high-light plant requirements.

Air Pumps: a couple like Tetra Whisper 20 (for up to 20 gal), etc., with their LPH output.

CO₂:

Fluval Pressurized 45g kit, CO2Art regulator kit, a DIY yeast kit perhaps. Mark if includes components.

A liquid carbon product (like Seachem Excel) could be included as co2Type: liquid (though not truly CO₂ gas, some use it as alternative).

Other Equipment:

Protein Skimmer: e.g. Coralife Super Skimmer (for up to 65 gal).

UV Sterilizer: maybe a 9W UV for freshwater up to 50 gal.

Automatic Feeder: basic Eheim feeder.

Thermometer: simple digital thermometer.

Test Kit: e.g. API Master Test Kit.

These others might be optional things user can add for completeness.

Each equipment has image (from manufacturer or generic).

productUrl could be to Amazon or manufacturer site for reference.

Substrates:

Aquasoils: Fluval Stratum (nutrient-rich, buffers to ~6.8 pH), ADA Aqua Soil Amazonia (nutrient-rich, lowers pH), etc.

Inert Gravels: e.g. Pea Gravel (neutral, various colors), Black Sand (like Black Diamond blasting sand, inert, fine), Pool Filter Sand (inert, light colored, fine).

Specialty: Crushed Coral (raises pH/hardness for African cichlids, buffers to ~8.0), aragonite sand (marine, buffers).

Eco-Complete Plant Substrate (nutrient-rich volcanic gravel).

We provide for each: whether it buffers pH and to what, grain size (like sand ~1 mm, gravel 5 mm, etc.), color, if it’s plant-friendly (Eco-Complete yes, Crushed Coral not ideal for plants due to high pH).

Price per pound and typical bag size: e.g. Fluval Stratum $1 per pound, sold in 8 lb bags; Pool sand $0.5 per pound in 50 lb bag, etc. So the app can say “you need ~30 lbs = 4 bags”.

Invertebrates:

Shrimps: e.g. Red Cherry Shrimp (Neocaridina, very popular, beginner, algae eater, sensitive to copper, will breed), Amano Shrimp (great algae eater, cannot breed in freshwater), Crystal Red Shrimp (more sensitive, needs soft water).

Snails: Nerite Snail (algae eater, cannot reproduce in freshwater), Mystery Snail (gets larger, can reproduce, peaceful), Malaysian Trumpet Snail (good burrower but can overrun tank).

Crabs: maybe a Fiddler Crab (brackish, needs land area – might illustrate not all are fully aquatic), or Thai Micro Crab (fully aquatic tiny).

Crayfish: Dwarf Orange Crayfish (CPO – small, can be kept with fish carefully), or a larger crayfish to show incompatibility (they often eat fish).

Clams: e.g. Freshwater Clam (filter feeder, requires well-fed water, can be tricky).

(Corals if we did saltwater, but that’s a whole separate thing. The prompt did list coral under invertebrates category – perhaps we include one to demonstrate saltwater compatibility).

For each, parameters (cherry shrimp: 65–80°F, pH 6.5–8, very low bioload, very peaceful; Mystery snail: similar, but note they produce a lot of waste relative to size). Predator/prey: many fish will eat shrimp – so shrimp entry will list larger fish as incompatible. Snails: loaches as predators.

CopperSensitive = true for all inverts like shrimp and snails (so the app could warn if user has copper in their water or uses meds, but we might not simulate that, but at least it’s data if needed).

This sample database allows assembling many possible scenarios. We have enough variety to test the rules: e.g. mixing a goldfish (cold water) with a tropical fish (should flag temp issue), mixing a big cichlid with tiny tetras (flag predation), trying a planted tank with a plant-eating fish (flag plant compatibility), a high-tech aquascape (light+CO₂ suggestions), a saltwater setup (mixing freshwater and saltwater items should be outright incompatible on multiple levels).

We should also include a couple of common pre-defined issues for demonstration:

e.g. Angelfish and Neon Tetra (predator/prey) – covered above.

Betta with another Betta – male Betta’s incompatibleWith could include its own species to disallow multiples.

Tiger Barbs with long-finned fish – Tiger Barb entry: nipsAtFins = true, so if any long-finned (like guppy or betta has incompatibleWithLongFinned = true maybe), warn.

African Cichlid with Tetra – African cichlid requires high pH/hard, tetra soft/acidic: no overlap, error for water params
aquariumstoredepot.com
.

Goldfish with tropical – Goldfish prefer cooler water and produce a lot of waste; a compatibility warning for temp mismatch and maybe high bioload.

Pleco in small tank – A common newbie mistake: putting a common pleco (grows huge) in a 10g. Our pleco entry will have min tank 75g, so adding it to smaller triggers error.

Multiple schools – If user adds 3 of Neon and 3 of Cardinal (two separate small schools <6 each), two warnings for each. Or maybe suggest making one bigger school rather than two tiny ones.

CO₂ without high light – no harm, but maybe an info suggestion “CO₂ is not necessary unless you have demanding plants” if they add CO₂ but all plants are low light.

Exceed filter capacity – user picks a small filter for a big tank, the app catches that using min/maxTankGallons on the filter.

By including these in the data, we ensure the app demonstrates its value with realistic scenarios.

Technical Implementation

Framework & Libraries: The app will be built with React and Next.js (likely using Next.js 13+ with the new App Router, or the classic pages – either works since it’s mostly client-side interactivity). Next.js is mainly used for ease of deployment and routing; since AquaBuilder is largely a client-side interactive tool, we may not need much SSR (except maybe for SEO if we had public pages like guides). We can use Next’s dynamic routes for build sharing (e.g. /build/[id] could load a build by ID).

Styling: We will use Tailwind CSS for rapid and consistent styling. Tailwind’s utility classes make it easy to implement the dark mode theme, responsive design, and special effects (like backdrop-blur for glassmorphism, animate-pulse for icons, etc.). We’ll set up a Tailwind config with our color palette (the deep blues, teal accents, etc.) to use as custom classes. Many components like modals and tooltips can be styled directly with Tailwind. For complex interactive components, we might incorporate Headless UI or Radix UI for accessible unstyled components (like modals, disclosure for accordion, listbox for selects, etc.), then style them with Tailwind.

Icons: We’ll use Lucide React for icons. Lucide is the toolkit which is a fork of Feather icons, offering a wide range. We will likely import icons such as Fish, Leaf, Thermometer, Droplet, AlertTriangle (for warnings), CheckCircle (for good), etc. For any custom ones like a tank shape or some aquatic motif, we can include SVGs manually if needed.

State Management:

We can implement a central BuildContext using React Context + useReducer. The reducer would handle actions like:

SET_TANK, ADD_FISH, REMOVE_FISH, UPDATE_FISH_QTY, ADD_PLANT, etc., as well as possibly SET_PARAM_TARGET if we allow user to override param settings.

Each action updates the AquariumBuild state accordingly, then we run a function to recalc the compatibility report and other computed fields. We’ll carefully organize this so that heavy calculations (like checking every combination) are done efficiently.

Alternatively, Zustand (a lightweight state library) could hold the build state, which might simplify accessing and updating it across components. Zustand allows direct mutate patterns and is quite performant. For a complex app, it can be simpler than prop-drilling context or writing a lot of reducer boilerplate. We can decide based on our comfort; the question suggests either approach is fine.

The compatibility logic can live in a separate module (pure functions that take a build and return a report). These can be unit-tested in isolation for correctness.

We also maintain separate data arrays for all Fish, Plants, etc., probably as static JSON or fetched from a local API route in Next. For simplicity, we can import them directly (Next will bundle them). The search and filter will run on these arrays.

Data Persistence:

For quick iteration, storing builds in localStorage is straightforward: whenever the build state updates, we serialize it (maybe just IDs and quantities rather than full objects to avoid redundancy) to localStorage (e.g. under key aquabuilder_builds). On app load, we check localStorage and load any saved builds.

If a user creates an account, we could sync to a backend (e.g. a simple Next API or Firebase). But as a production-ready note, we mention that this could be implemented but is optional.

Shareable URLs: One method is to encode all selections in the URL (like ?fish=neon-10,guppy-5&plants=anubias-2...), but that can get long. Better is to save the build to a database and use its ID. Without a backend, we could use the URL to encode a base64 JSON and have the app parse it, but that’s advanced and might hit length issues. For now, we propose a unique ID approach, which implies needing some persistence (maybe in-memory map of id->build, which resets on refresh though). In a real deployment, we’d back it with a DB.

Performance Considerations:

Given relatively small data sets (tens of items each category), basic loops and filters are fine. But we should still ensure not to do very expensive computations in rendering frequently.

Use memoization (React’s useMemo) for derived data like the compatibility report to only recalc when relevant parts of state change. For instance, if we update fish quantity, no need to recalc plant-substrate compatibility, but our function will likely just recalc all aspects each time – which is fine at small scale. If scaling up, we’d optimize by splitting checks.

Virtualized lists: If in the future we had 100s of fish in database, the browse list could be long – we can integrate react-window to only render items in view. For now ~30 items, it’s okay, but good to plan for scaling if the database grows (the user could filter anyway).

Debounce search input as mentioned to avoid re-filter on every keystroke, improving perceived performance.

Accessibility (a11y):
We aim for WCAG-compliant design:

All interactive controls will be reachable via keyboard (e.g. hitting Enter on a focused card will open details or add, arrow keys to move between cards if possible in a grid, etc.).

Use proper ARIA roles: the modals have role="dialog" with aria-modal="true" and focus trap inside (can use Headless UI Dialog which handles a lot). The accordion for categories can use role="tree"/treeitem or simpler button controls with aria-expanded to indicate state.

Ensure color contrast meets guidelines: our dark background and light text likely passes, but for text on teal accents, ensure sufficient contrast. Use Tailwind’s built-in styles or adjust colors slightly if needed.

For color indicators, always pair with text or an icon. E.g. don’t just say “Problems highlighted in red” – also label them as “Error” or use an icon with alt text.

Provide alt text for all images: e.g. fish images get alt like “Photo of Neon Tetra”. Decorative background images can be marked with empty alt if not informative.

Font sizes should be readable (we won’t use super tiny fonts; Tailwind default text-sm is fine for side notes, but main text at least text-base or larger).

Possibly include a toggle for dyslexia-friendly font or high-contrast mode if needed, but not in initial scope.

Keyboard navigation: We should test that one can tab through the interface logically: header links first, then main add buttons, etc. Implement skip links if there’s a lot of nav content (maybe not needed in a single-page app).

ARIA Live regions: We might use aria-live to announce compatibility changes for screen reader users. For instance, when a user adds a fish that triggers a warning, we could have a visually hidden live region that updates like “Warning: Angelfish incompatible with Neon Tetra” so it’s read out.

Use semantic HTML as much as possible: e.g. lists for lists of items, buttons for clickable, etc.

Responsive Implementation:
We’ll leverage Flexbox and Grid via Tailwind for layout:

Desktop: likely a grid with two columns (sidebar and main content) and maybe the header spanning top. Or flex with sidebar and flex-grow main.

Tablet: sidebar can collapse – maybe each category is a horizontal bar that can expand vertically (accordions).

Mobile: might hide the sidebar entirely and rely on a different nav (tabs or a single Add button).

We can use Tailwind breakpoints (e.g. hidden md:block to hide sidebar on mobile, and show an alternate UI).

Testing and tweaking at different sizes will ensure it’s smooth.

Animations & Microinteractions:
We want to add polish but also be mindful of not hurting performance or accessibility:

Use CSS transitions for things like hover highlights, panel expand (Tailwind’s transition classes).

For the water ripple effect on the logo, we could use an SVG filter or a small CSS animation (like animate background-position of a water texture).

Caustics background: possibly include a looped video or canvas? A simpler way is an SVG with filter feTurbulence animating. There are known snippets for water caustics using CSS only (as per references). We can layer that behind content with low opacity.

Glassmorphism: simply done by Tailwind class backdrop-blur-lg bg-white/10 (white with 10% opacity) on cards or modals. Also add a border (1px solid white with some opacity) to get the frosted edge.

Smooth accordion: we can add a CSS transition on max-height or use a library for accordions. Or use headless UI’s Transition component for smoother opening.

Loading animations: If any data loading needed (initial data could be fetched), show a spinner or shimmer. But since data is likely static in bundle, no loading state except maybe when saving or sharing.

Compatibility status icon pulse: use animate-pulse class on it when warnings exist to draw eye subtly.

Stocking bar fill animation: when the percentage changes, we can animate the width from old % to new with a CSS transition on width.

Price count-up: e.g. when user adds an item, total cost could increment with a short animation (some use a library for odometer-like effect). Or simpler: use a React state that tweens (maybe using react-spring or a custom requestAnimationFrame increment) to animate the number. That might be overkill; a simpler approach: just highlight the cost text briefly (flash green or red on change) to indicate a change.

On adding an item, maybe animate its card flying into the build summary or a little plus icon moving – nice but optional.

Hover states: Buttons could slightly scale up and drop shadow on hover (Tailwind hover:scale-105 hover:shadow-lg). Links can underline or glow.

Error & Empty States:

If the user hasn’t selected a tank yet (empty build start), show a friendly message in the Build Dashboard area: maybe an outline of a tank with an arrow “Start by choosing an aquarium tank”. Possibly a call-to-action button “Choose Tank” that opens the tank browse modal.

If a category has no items after filtering (search yields nothing or the compatibility filter removed all): show a message like “No items match your criteria.” and maybe tips like “Try broadening your search or toggling off ‘compatible only’ to see all options.” We can even show some popular items as a fallback or a prompt to reset filters.

If a category is empty (like no fish added yet), the panel can have an illustration icon (like a faded fish icon with “No fish added. Use search or browse to add your first fish.”).

If the compatibility engine finds an incompatibility, we might highlight the problematic items in the UI itself as well (e.g. outline in red the species that conflict). For example, if Angelfish and Neon Tetra are incompatible, maybe in the fish list those two get a red border or an icon next to them. This cross-highlighting is helpful. If the user clicks that icon, it could scroll to the warning explanation.

When data fails to load (if we fetched from API and got error), show an error message in that section “Failed to load data, please check connection or retry.” with a Retry button. Since we likely bundle data, this might not occur. But maybe if using an external API for prices, handle network errors gracefully.

404 pages (Next.js route fallback): If user goes to an unknown route, we can present a fun 404 like “You seem to be fishing in uncharted waters…” with link back home.

Finally, assembling all of the above, we will implement the application in a single Next.js project. Each of these components likely corresponds to either a React component or a group of components. We will ensure the code is clean and well-organized:

Use functional components with hooks.

Possibly split state: one context for current build, another for the global catalogue data.

Use PropTypes or TypeScript for type checking (TypeScript preferred in a prod-ready app for catching errors).

Testing: If this were production, we’d write unit tests for the compatibility functions, and some integration tests for adding items, etc. Due to scope, we just mention it.

Given all these considerations, AquaBuilder will be developed as a robust, user-friendly tool that can genuinely assist aquarium planners in creating a thriving aquatic environment – from concept to maintenance. The combination of a sleek UI, comprehensive data, and intelligent compatibility logic makes it a unique “ultimate aquarium builder” experience
aqadvisor.com
, much like PCPartPicker revolutionized PC building.

Next Steps: The actual coding of this application involves creating React components for each UI piece described, wiring up the state logic, and thorough testing with sample scenarios. We’re confident the end result will feel like a production-ready application that aquarium enthusiasts will love to use for planning their next tank!