"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './settings.module.css';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function SettingsLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className={`${styles.settingsContainer} ${styles.variables}`}>
       
         
          {children}
     
      </div>
    </ProtectedRoute>
  );
}