# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mapta is a public-facing interactive map of manta ray aggregation hotspots, marine protected area (MPA) boundaries, and citizen science sighting density. The target audience is researchers, conservationists, and marine enthusiasts.

## Build & Run Commands

```bash
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build locally
```

Requires a `.env` file (copy from `.env.example`) with a valid `VITE_MAPBOX_TOKEN`.

## Tech Stack

- **React + Vite** — UI and build tooling
- **Mapbox GL JS** — map rendering (dark-v11 style)
- **GeoJSON** — data format; static files live in `public/data/`
- **Supabase or Airtable** (not yet integrated) — optional backend if hotspot data needs editing without redeployment

## Architecture

The map is built around **toggleable layers**:

| Layer | Type | Data source |
|---|---|---|
| MPA boundaries | Polygon | Marine Regions / Protected Planet (free GeoJSON/shapefiles) |
| Manta hotspots | Point | Manually compiled from research papers; filterable by species and season |
| Sighting density | Heatmap | iNaturalist export + GBIF API |
| Shipping lanes / fishing pressure | Optional overlay | Global Fishing Watch |

Clicking a hotspot should surface: photo, species, best season, and a link to the source research paper.

## Data Sources

- **MPA boundaries:** [Marine Regions](https://www.marineregions.org), [Protected Planet](https://www.protectedplanet.net) — no scraping, direct download
- **Hotspots:** Manual spreadsheet compiled from Google Scholar and Manta Trust research portal (expect 20–50 sites with lat/long, species, seasonality, citation)
- **Sightings:** [iNaturalist](https://www.inaturalist.org) (free export), [GBIF API](https://www.gbif.org/developer/summary) (free)
- **Optional overlays:** [Global Fishing Watch](https://globalfishingwatch.org)

## Design Direction

Dark ocean aesthetic with glowing data points (reference: Global Fishing Watch map). Clean, editorial feel (reference: The Ocean Agency). Consider scroll-based storytelling for the user experience.
