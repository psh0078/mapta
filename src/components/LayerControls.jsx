import styles from './LayerControls.module.css';

const MPA_LEGEND = [
  { label: 'Ia / Ib / II — Strict', color: '#00ffd0' },
  { label: 'III / IV — Habitat mgmt', color: '#00785c' },
  { label: 'V / VI — Sustainable use', color: '#003d2e' },
];

const SPECIES = [
  { value: null, label: 'All species' },
  { value: 'Mobula birostris', label: 'M. birostris (oceanic)' },
  { value: 'Mobula alfredi', label: 'M. alfredi (reef)' },
];

export default function LayerControls({ layers, onChange, filterSpecies, onFilterSpecies }) {
  const toggle = (key) => onChange((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Layers</p>

      <label className={styles.item}>
        <input type="checkbox" checked={layers.mpas} onChange={() => toggle('mpas')} />
        <span className={styles.dot} style={{ background: '#00c89a', borderRadius: 2 }} />
        MPA Boundaries
      </label>
      {layers.mpas && (
        <div className={styles.legend}>
          {MPA_LEGEND.map(({ label, color }) => (
            <div key={label} className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      <label className={styles.item}>
        <input type="checkbox" checked={layers.heatmap} onChange={() => toggle('heatmap')} />
        <span className={styles.dot} style={{ background: '#00e6b4' }} />
        Sighting Density
      </label>

      <label className={styles.item}>
        <input type="checkbox" checked={layers.institutions} onChange={() => toggle('institutions')} />
        <span className={styles.dot} style={{ background: '#ffb347' }} />
        Research Institutions
      </label>

      <label className={styles.item}>
        <input type="checkbox" checked={layers.hotspots} onChange={() => toggle('hotspots')} />
        <span className={styles.dot} style={{ background: '#00d4ff' }} />
        Manta Hotspots
      </label>
      {layers.hotspots && (
        <div className={styles.filter}>
          {SPECIES.map(({ value, label }) => (
            <label key={label} className={styles.radio}>
              <input
                type="radio"
                name="species"
                checked={filterSpecies === value}
                onChange={() => onFilterSpecies(value)}
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
