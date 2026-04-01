import { useState, useEffect, useRef } from 'react';
import styles from './Search.module.css';

export default function Search({ map }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [features, setFeatures] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/data/hotspots.geojson')
      .then((r) => r.json())
      .then((d) => setFeatures(d.features));
  }, []);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setResults(
      features
        .filter((f) => f.properties.name.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6)
    );
  }

  function flyTo(feature) {
    map.flyTo({ center: feature.geometry.coordinates, zoom: 6, duration: 1500 });
    setQuery('');
    setResults([]);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setQuery(''); setResults([]); }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <svg className={styles.icon} viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search hotspots…"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button className={styles.clear} onClick={() => { setQuery(''); setResults([]); }}>×</button>
        )}
      </div>
      {results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((f) => (
            <li key={f.properties.name} className={styles.item} onClick={() => flyTo(f)}>
              <span className={styles.name}>{f.properties.name}</span>
              <span className={styles.species}>{f.properties.species.replace('Mobula ', 'M. ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
