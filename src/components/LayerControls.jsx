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

const MONTHS = [
  { value: null,  label: 'Any month' },
  { value: 1,  label: 'January' },
  { value: 2,  label: 'February' },
  { value: 3,  label: 'March' },
  { value: 4,  label: 'April' },
  { value: 5,  label: 'May' },
  { value: 6,  label: 'June' },
  { value: 7,  label: 'July' },
  { value: 8,  label: 'August' },
  { value: 9,  label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function LayerControls({ layers, onChange, filterSpecies, onFilterSpecies, filterMonth, onFilterMonth }) {
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
          <div className={styles.divider} />
          <select
            className={styles.select}
            value={filterMonth ?? ''}
            onChange={(e) => onFilterMonth(e.target.value ? Number(e.target.value) : null)}
          >
            {MONTHS.map(({ value, label }) => (
              <option key={label} value={value ?? ''}>{label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
