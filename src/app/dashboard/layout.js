"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from '../dashboard.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiHome, FiSettings, FiFileText, FiUser, FiSearch, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Eliminar la información del usuario del localStorage
    localStorage.removeItem('user');
    // Redirigir al login
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className={`${styles.dashboard} ${styles.variables}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Blog Admin</h2>
          </div>
          <nav className={styles.sidebarNav}>
            <ul>
              <li className={styles.active}>
                <Link href="/dashboard">
                  <FiHome size={18} /> Inicio
                </Link>
              </li>
              <li>
                <Link href="/create-post">
                  <FiFileText size={18} /> Crear Post
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <FiSettings size={18} /> Configuración
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.toolbar}>
            <div className={styles.searchBar}>
              <FiSearch size={18} />
              <input type="text" placeholder="Buscar..." />
            </div>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'Usuario'}</span>
                <span className={styles.userRole}>{user?.role || 'Admin'}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}