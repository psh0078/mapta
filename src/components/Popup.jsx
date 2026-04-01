import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './Popup.module.css';

export default function Popup({ lngLat, properties, map, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = styles.container;
    el.innerHTML = `
      <button class="${styles.close}" aria-label="Close">×</button>
      <h3 class="${styles.title}">${properties.name}</h3>
      <div class="${styles.meta}">
        <span class="${styles.badge}">${properties.species}</span>
        <span class="${styles.season}">Best: ${properties.season}</span>
      </div>
      <p class="${styles.description}">${properties.description}</p>
      <p class="${styles.citation}">Source: ${properties.citation}</p>
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
