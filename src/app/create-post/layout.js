"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './create-post.module.css';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function CreatePostLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className={`${styles.createPostContainer} ${styles.variables}`}>
        <div className={styles.createPostCard}>
          <div className={styles.createPostHeader}>
            <Link href="/" className={styles.backLink}>
              <FiArrowLeft size={16} /> Volver al inicio
            </Link>
            <h1>Crear Nuevo Post</h1>
            <p>Crea y publica un nuevo artículo en tu blog</p>
          </div>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}