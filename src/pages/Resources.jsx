import { useState } from 'react';
import { resources, categories } from '../data/resources';
import styles from './Resources.module.css';

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Education Resources</h1>
        <p className={styles.subtitle}>
          Academic papers, conservation guides, citizen science platforms, and media covering manta ray biology and marine conservation.
        </p>
      </div>

      <div className={styles.filters}>
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            className={`${styles.filter} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((r) => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.cardTop}>
              <span className={styles.category}>{r.category}</span>
              {r.year && <span className={styles.year}>{r.year}</span>}
            </div>
            <h3 className={styles.cardTitle}>{r.title}</h3>
            <p className={styles.authors}>{r.authors}</p>
            <p className={styles.description}>{r.description}</p>
            <div className={styles.cardFooter}>
              <span className={styles.source}>{r.source}</span>
              <span className={styles.arrow}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
