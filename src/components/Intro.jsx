import { useState, useEffect, useRef } from 'react';
import styles from './Intro.module.css';

function AnimatedNumber({ target, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!target) return;
    const duration = 1200;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (target - from) * ease));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return (
    <span>{display.toLocaleString()}{suffix}</span>
  );
}

// Chapters are defined as a function so we can inject live data
function buildChapters(sightingsCount) {
  return [
    {
      flyTo: null,
      stat: null,
      label: null,
      title: 'Mapta',
      body: 'Mapping the world\'s manta ray aggregation hotspots, protected areas, and sighting density.',
    },
    {
      flyTo: { center: [73.1, -0.5], zoom: 5.5, duration: 2500 },
      stat: 200,
      statSuffix: '+',
      label: 'mantas recorded in a single tide at Hanifaru Bay, Maldives',
      title: 'They return to the same waters, year after year.',
      body: 'Aggregation hotspots are predictable — and that predictability makes them both researchable and vulnerable.',
    },
    {
      flyTo: { center: [20, 10], zoom: 2, duration: 2500 },
      stat: 8,
      statSuffix: '',
      label: 'marine protected areas cover known manta hotspots in this dataset',
      title: 'Marine protected areas are their strongest shield.',
      body: 'MPAs can reduce fishing pressure and boat strikes — but coverage of critical habitat remains patchy.',
    },
    {
      flyTo: { center: [115, 5], zoom: 3, duration: 2500 },
      stat: sightingsCount || null,
      statSuffix: '',
      label: 'research-grade Mobula sightings from citizen scientists on iNaturalist',
      title: 'Citizen science is filling in the gaps.',
      body: 'Public observations reveal manta range far beyond documented hotspots — and the data keeps growing.',
    },
  ];
}

export default function Intro({ map, sightingsCount, onDismiss }) {
  const [chapter, setChapter] = useState(0);
  const [exiting, setExiting] = useState(false);

  const chapters = buildChapters(sightingsCount);
  const isLast = chapter === chapters.length - 1;
  const current = chapters[chapter];

  useEffect(() => {
    if (current.flyTo && map) {
      map.flyTo({ ...current.flyTo, essential: true });
    }
  }, [chapter]);

  function advance() {
    if (isLast) {
      setExiting(true);
      setTimeout(onDismiss, 500);
    } else {
      setChapter((n) => n + 1);
    }
  }

  return (
    <div className={`${styles.scrim} ${exiting ? styles.exit : ''}`}>
      <div className={styles.card}>
        {chapter === 0 ? (
          <>
            <div className={styles.coverTitle}>Mapta</div>
            <p className={styles.coverSub}>{current.body}</p>
          </>
        ) : (
          <>
            {current.stat != null ? (
              <div className={styles.statBlock}>
                <div className={styles.statNumber}>
                  <AnimatedNumber key={chapter} target={current.stat} suffix={current.statSuffix} />
                </div>
                <div className={styles.statLabel}>{current.label}</div>
              </div>
            ) : (
              current.stat === null && current.label && (
                <div className={styles.statBlock}>
                  <div className={styles.statLoading}>Loading…</div>
                  <div className={styles.statLabel}>{current.label}</div>
                </div>
              )
            )}
            <h2 className={styles.chapterTitle}>{current.title}</h2>
            <p className={styles.body}>{current.body}</p>
          </>
        )}

        <div className={styles.footer}>
          <div className={styles.dots}>
            {chapters.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i === chapter ? styles.dotActive : ''}`} />
            ))}
          </div>
          <button className={styles.btn} onClick={advance}>
            {isLast ? 'Explore the map →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
