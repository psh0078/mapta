import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>Mapta</span>
      <div className={styles.links}>
        <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          Map
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          Resources
        </NavLink>
      </div>
    </nav>
  );
}
