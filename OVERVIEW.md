# Mapta
### A public-facing interactive map of manta ray hotspots, MPA boundaries, and sighting density

---

## Step 1: Get the Data

- **MPA boundaries** — The easiest win. [Marine Regions](https://www.marineregions.org) and [Protected Planet](https://www.protectedplanet.net) both offer free, downloadable GeoJSON/shapefiles of marine protected areas worldwide. No scraping needed.
- **Manta hotspots** — Compile manually from published research papers (Google Scholar, the Manta Trust's research portal). Build a spreadsheet of known aggregation sites with lat/long, species, seasonality, and source citation. Expect 20–50 well-documented sites globally.
- **Sighting density** — iNaturalist has publicly accessible manta ray observation data you can export for free. GBIF (Global Biodiversity Information Facility) also aggregates citizen science sightings and has a free API.

---

## Step 2: Pick Your Tech Stack

- **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)** or **[Deck.gl](https://deck.gl)** — both handle large datasets beautifully and support custom styling. Mapbox has a generous free tier.
- **React** for the UI around the map
- **GeoJSON** as your data format throughout
- **Supabase or Airtable** as a lightweight backend if you want the hotspot data to be editable without redeploying

---

## Step 3: Design the Layers

Think of the map as toggleable layers:

- **MPA boundaries** — polygon layer, colored by protection level
- **Manta hotspots** — point layer, filterable by species and season
- **Sighting density** — heatmap layer from iNaturalist/GBIF data
- **Optional:** shipping lanes, fishing pressure zones (available from [Global Fishing Watch](https://globalfishingwatch.org))

---

## Step 4: Make it Beautiful

This is where creativity matters. Reference maps to study:

- [Global Fishing Watch](https://globalfishingwatch.org/map) — dark ocean aesthetic, glowing data points
- [The Ocean Agency](https://www.theoceanagency.org) — clean, editorial feel
- Neal Agarwal's interactive ocean depth map — scroll-based storytelling inspiration

When a user clicks a hotspot, show a photo, the species, best season to visit, and a link to the research paper it came from.

---

## Step 5: Launch & Grow It

- Submit Mapta to the Manta Trust and Marine Megafauna Foundation — they may want to link to it or collaborate
- Open-source the code on GitHub so researchers can contribute hotspot data
- Write a short piece on Medium or Substack about building it — that audience will share it

---

## Realistic Timeline

**4–8 weeks** for a solid first version building on weekends. The data compilation in Step 1 is the most time-consuming part.
