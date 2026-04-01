import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Popup from './Popup';
import MpaPopup from './MpaPopup';
import InstitutionPopup from './InstitutionPopup';
import LayerControls from './LayerControls';
import Intro from './Intro';
import Search from './Search';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MONTH_NUMS = {
  Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12
};

function isActiveInMonth(season, month) {
  if (!month || !season || season === 'Year-round') return true;
  const m = season.match(/([A-Z][a-z]+)[–-]([A-Z][a-z]+)/);
  if (!m) return true;
  const start = MONTH_NUMS[m[1].slice(0, 3)];
  const end   = MONTH_NUMS[m[2].slice(0, 3)];
  if (!start || !end) return true;
  return start <= end
    ? month >= start && month <= end
    : month >= start || month <= end; // wraps year (e.g. Nov–May)
}

async function fetchSightings() {
  const res = await fetch(
    'https://api.inaturalist.org/v1/observations?taxon_name=Mobula&per_page=200&geo=true&quality_grade=research&order_by=observed_on&order=desc'
  );
  const data = await res.json();
  return {
    type: 'FeatureCollection',
    features: data.results
      .filter((o) => o.location)
      .map((o) => {
        const [lat, lng] = o.location.split(',').map(Number);
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {},
        };
      }),
  };
}

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('mapta_intro_seen'));
  const [sightingsCount, setSightingsCount] = useState(null);
  const [popup, setPopup] = useState(null);
  const [mpaPopup, setMpaPopup] = useState(null);
  const [institutionPopup, setInstitutionPopup] = useState(null);
  const [layers, setLayers] = useState({ hotspots: true, mpas: true, heatmap: true, institutions: true });
  const [filterSpecies, setFilterSpecies] = useState(null); // null = all
  const [filterMonth, setFilterMonth] = useState(null);    // null = all
  const [allHotspots, setAllHotspots] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [20, 0],
      zoom: 2,
      projection: 'mercator',
    });

    map.current.on('load', async () => {
      // ── MPA layer ──────────────────────────────────────────────
      map.current.addSource('mpas', {
        type: 'geojson',
        data: '/data/mpas.geojson',
      });

      map.current.addLayer({
        id: 'mpas-fill',
        type: 'fill',
        source: 'mpas',
        paint: {
          'fill-color': [
            'match', ['get', 'iucn_category'],
            'Ia', '#00ffd0', 'Ib', '#00ffd0',
            'II', '#00c89a',
            'III', '#009e7a',
            'IV', '#00785c',
            'V', '#005540',
            'VI', '#003d2e',
            '#004d3a',
          ],
          'fill-opacity': 0.25,
        },
      });

      map.current.addLayer({
        id: 'mpas-outline',
        type: 'line',
        source: 'mpas',
        paint: {
          'line-color': [
            'match', ['get', 'iucn_category'],
            'Ia', '#00ffd0', 'Ib', '#00ffd0',
            'II', '#00c89a',
            'III', '#009e7a',
            'IV', '#00785c',
            'V', '#005540',
            'VI', '#003d2e',
            '#004d3a',
          ],
          'line-opacity': 0.7,
          'line-width': 1,
        },
      });

      map.current.on('click', 'mpas-fill', (e) => {
        // Don't open MPA popup if a hotspot is at the same spot
        const hotspotFeatures = map.current.queryRenderedFeatures(e.point, {
          layers: ['hotspots-layer'],
        });
        if (hotspotFeatures.length > 0) return;
        setMpaPopup({ lngLat: e.lngLat, properties: e.features[0].properties });
        setPopup(null);
      });

      map.current.on('mouseenter', 'mpas-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'mpas-fill', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // ── Sighting heatmap ───────────────────────────────────────
      map.current.addSource('sightings', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.current.addLayer({
        id: 'sightings-heat',
        type: 'heatmap',
        source: 'sightings',
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 6, 2],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 20, 6, 40],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgba(0,80,120,0.5)',
            0.5, 'rgba(0,180,200,0.7)',
            0.8, 'rgba(0,230,180,0.85)',
            1, 'rgba(255,255,180,1)',
          ],
          'heatmap-opacity': 0.75,
        },
      });

      fetchSightings()
        .then((geojson) => {
          if (map.current) map.current.getSource('sightings').setData(geojson);
          setSightingsCount(geojson.features.length);
        })
        .catch(console.error);

      // ── Institutions ──────────────────────────────────────────
      map.current.addSource('institutions', {
        type: 'geojson',
        data: '/data/institutions.geojson',
      });

      map.current.addLayer({
        id: 'institutions-layer',
        type: 'circle',
        source: 'institutions',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ffb347',
          'circle-opacity': 0.9,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.5,
        },
      });

      map.current.on('click', 'institutions-layer', (e) => {
        setInstitutionPopup({ lngLat: e.lngLat, properties: e.features[0].properties });
        setPopup(null);
        setMpaPopup(null);
      });

      map.current.on('mouseenter', 'institutions-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'institutions-layer', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // ── Hotspot glow + points ──────────────────────────────────
      const hotspotsRes = await fetch('/data/hotspots.geojson');
      const hotspotsData = await hotspotsRes.json();
      setAllHotspots(hotspotsData);

      map.current.addSource('hotspots', {
        type: 'geojson',
        data: hotspotsData,
      });

      map.current.addLayer({
        id: 'hotspots-glow',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-radius': 18,
          'circle-color': '#00d4ff',
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      });

      map.current.addLayer({
        id: 'hotspots-layer',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-radius': 7,
          'circle-color': '#00d4ff',
          'circle-opacity': 0.9,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.6,
        },
      });

      map.current.on('click', 'hotspots-layer', (e) => {
        setPopup({ lngLat: e.lngLat, properties: e.features[0].properties });
        setMpaPopup(null);
      });

      map.current.on('mouseenter', 'hotspots-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'hotspots-layer', () => {
        map.current.getCanvas().style.cursor = '';
      });

      setMapReady(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Layer visibility
  useEffect(() => {
    if (!map.current?.isStyleLoaded()) return;
    const v = (on) => (on ? 'visible' : 'none');
    const safely = (id, vis) => {
      if (map.current.getLayer(id)) map.current.setLayoutProperty(id, 'visibility', vis);
    };
    safely('hotspots-layer', v(layers.hotspots));
    safely('hotspots-glow', v(layers.hotspots));
    safely('mpas-fill', v(layers.mpas));
    safely('mpas-outline', v(layers.mpas));
    safely('sightings-heat', v(layers.heatmap));
    safely('institutions-layer', v(layers.institutions));
  }, [layers]);

  // Species filter
  useEffect(() => {
    if (!map.current?.isStyleLoaded()) return;
    const filter = filterSpecies ? ['==', ['get', 'species'], filterSpecies] : null;
    ['hotspots-layer', 'hotspots-glow'].forEach((id) => {
      if (map.current.getLayer(id)) map.current.setFilter(id, filter);
    });
  }, [filterSpecies]);

  // Month filter — update source data client-side
  useEffect(() => {
    if (!map.current?.isStyleLoaded() || !allHotspots) return;
    const source = map.current.getSource('hotspots');
    if (!source) return;
    const filtered = {
      ...allHotspots,
      features: allHotspots.features.filter((f) =>
        isActiveInMonth(f.properties.season, filterMonth)
      ),
    };
    source.setData(filtered);
  }, [filterMonth, allHotspots]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', paddingTop: 48 }}>
      <div ref={mapContainer} style={{ width: '100%', height: 'calc(100vh - 48px)' }} />

      {mapReady && <Search map={map.current} />}

      <LayerControls
        layers={layers}
        onChange={setLayers}
        filterSpecies={filterSpecies}
        onFilterSpecies={setFilterSpecies}
        filterMonth={filterMonth}
        onFilterMonth={setFilterMonth}
      />

      {popup && (
        <Popup
          key={popup.properties.name}
          lngLat={popup.lngLat}
          properties={popup.properties}
          map={map.current}
          onClose={() => setPopup(null)}
        />
      )}

      {mpaPopup && (
        <MpaPopup
          key={mpaPopup.properties.name}
          lngLat={mpaPopup.lngLat}
          properties={mpaPopup.properties}
          map={map.current}
          onClose={() => setMpaPopup(null)}
        />
      )}

      {institutionPopup && (
        <InstitutionPopup
          key={institutionPopup.properties.name}
          lngLat={institutionPopup.lngLat}
          properties={institutionPopup.properties}
          map={map.current}
          onClose={() => setInstitutionPopup(null)}
        />
      )}

      {showIntro && mapReady && (
        <Intro
          map={map.current}
          sightingsCount={sightingsCount}
          onDismiss={() => {
            localStorage.setItem('mapta_intro_seen', '1');
            setShowIntro(false);
          }}
        />
      )}
    </div>
  );
}
