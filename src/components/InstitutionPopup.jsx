import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './Popup.module.css';

const TYPE_LABELS = {
  NGO: 'Non-governmental org',
  Research: 'Research institution',
  Intergovernmental: 'Intergovernmental body',
};

export default function InstitutionPopup({ lngLat, properties, map, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    const { name, type, location, focus, url } = properties;
    const typeLabel = TYPE_LABELS[type] ?? type;

    const el = document.createElement('div');
    el.className = styles.container;
    el.innerHTML = `
      <button class="${styles.close}" aria-label="Close">×</button>
      <h3 class="${styles.title}">${name}</h3>
      <div class="${styles.meta}">
        <span class="${styles.badge}" style="background:rgba(255,179,71,0.15);color:#ffb347">${typeLabel}</span>
        <span class="${styles.season}">${location}</span>
      </div>
      <p class="${styles.description}">${focus}</p>
      <p class="${styles.citation}">
        <a href="${url}" target="_blank" rel="noopener noreferrer"
           style="color:#ffb347;text-decoration:none">${url.replace('https://', '')}</a>
      </p>
    `;

    el.querySelector('button').addEventListener('click', onClose);

    popupRef.current = new mapboxgl.Popup({ closeButton: false, maxWidth: '280px' })
      .setLngLat(lngLat)
      .setDOMContent(el)
      .addTo(map);

    return () => popupRef.current?.remove();
  }, []);

  return null;
}
