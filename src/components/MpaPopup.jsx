import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './Popup.module.css';

const IUCN_LABELS = {
  'Ia': 'Strict Nature Reserve',
  'Ib': 'Wilderness Area',
  'II': 'National Park',
  'III': 'Natural Monument',
  'IV': 'Habitat / Species Management',
  'V': 'Protected Landscape',
  'VI': 'Managed Resource',
};

export default function MpaPopup({ lngLat, properties, map, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    const { name, country, iucn_category, area_km2 } = properties;
    const label = IUCN_LABELS[iucn_category] ?? iucn_category;
    const area = area_km2 ? `${Number(area_km2).toLocaleString()} km²` : '—';

    const el = document.createElement('div');
    el.className = styles.container;
    el.innerHTML = `
      <button class="${styles.close}" aria-label="Close">×</button>
      <h3 class="${styles.title}">${name}</h3>
      <div class="${styles.meta}">
        <span class="${styles.badge}">IUCN ${iucn_category}</span>
        <span class="${styles.season}">${country}</span>
      </div>
      <p class="${styles.description}">${label}</p>
      <p class="${styles.citation}">Area: ${area}</p>
    `;

    el.querySelector('button').addEventListener('click', onClose);

    popupRef.current = new mapboxgl.Popup({ closeButton: false, maxWidth: '260px' })
      .setLngLat(lngLat)
      .setDOMContent(el)
      .addTo(map);

    return () => popupRef.current?.remove();
  }, []);

  return null;
}
