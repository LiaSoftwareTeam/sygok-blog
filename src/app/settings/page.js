"use client"
import React, { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { FiUser, FiLock, FiUserPlus, FiUsers, FiEdit, FiHome, FiFileText, FiSettings, FiPlus } from 'react-icons/fi';
import { RiDashboardLine } from "react-icons/ri";
import Link from 'next/link';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modifiedUsers, setModifiedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Estado para el formulario de creación de usuario
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState({ username: false, password: false });

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    // Eliminar error cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Función para validar y enviar el formulario de nuevo usuario
  const handleCreateUser = (e) => {
    e.preventDefault();
    
    // Validación
    const errors = {
      username: !newUser.username.trim(),
      password: !newUser.password.trim()
    };
    
    setFormErrors(errors);
    
    // Si no hay errores, crear el usuario
    if (!errors.username && !errors.password) {
      const newUserObj = {
        id: users.length + 1,
        username: newUser.username,
        role: 'admin' // Por defecto todos son admin como se solicitó
      };
      
      setUsers(prev => [...prev, newUserObj]);
      setNewUser({ username: '', password: '' }); // Limpiar formulario
      console.log('Usuario creado:', newUserObj);
    }
  };

  // Función para manejar cambios en el rol
  const handleRoleChange = (userId, newRole) => {
    setModifiedUsers(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  // Función para actualizar el rol de un usuario
  const handleUpdateUser = async (userId) => {
    const newRole = modifiedUsers[userId];
    if (!newRole) return; // Si no hay cambios, no hacer nada

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        rol: newRole
      });
      
      // Actualizar el estado local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, rol: newRole } : user
        )
      );

      // Limpiar el estado de modificación para este usuario
      setModifiedUsers(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  return (
    <div className={`${styles.dashboard} ${styles.variables}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <RiDashboardLine size={24} />
          <h2>Blog Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link href="/"><FiHome size={18} /> Dashboard</Link>
            </li>
            <li className={styles.active}>
              <Link href="/settings"><FiSettings size={18} /> Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.settingsHeader}>
          <h1><FiSettings size={24} /> Configuración</h1>
          <p>Administra los usuarios y configuraciones del sistema</p>
        </div>
        
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2><FiUsers size={20} /> Usuarios Existentes</h2>
            <p>Administra los usuarios existentes y sus roles</p>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Nombre de usuario</th>
                  <th>Rol actual</th>
                  <th>Cambiar rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className={styles.loadingState}>Cargando usuarios...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className={styles.errorState}>{error}</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.emptyState}>No hay usuarios registrados</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.usuario || user.nombre}</td>
                      <td>{user.rol}</td>
                      <td>
                        <select 
                          value={modifiedUsers[user.id] || user.rol}
                          className={styles.roleSelect}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="admin">admin</option>
                          <option value="visualizador">visualizador</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className={`${styles.updateButton} ${!modifiedUsers[user.id] ? styles.buttonDisabled : ''}`}
                          onClick={() => handleUpdateUser(user.id)}
                          disabled={!modifiedUsers[user.id]}
                        >
                          <FiEdit size={16} /> Actualizar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className={styles.addButtonContainer}>
            <Link href="/settings/create-user" className={styles.addButton}>
              <FiPlus size={18} /> Agregar Usuario
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}