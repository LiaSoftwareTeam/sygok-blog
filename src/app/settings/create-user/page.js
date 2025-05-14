"use client"
import React, { useState } from 'react';
import styles from '../settings.module.css';
import { FiUser, FiLock, FiUserPlus, FiHome, FiFileText, FiSettings, FiArrowLeft } from 'react-icons/fi';
import { RiDashboardLine } from "react-icons/ri";
import Link from 'next/link';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default function CreateUser() {
  // Estado para el formulario de creación de usuario
  const [newUser, setNewUser] = useState({ nombre: '', usuario: '', password: '', role: 'admin' });
  const [formErrors, setFormErrors] = useState({ nombre: false, usuario: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });

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
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Validación
    const errors = {
      nombre: !newUser.nombre.trim(),
      usuario: !newUser.usuario.trim(),
      password: !newUser.password.trim()
    };
    
    setFormErrors(errors);
    
    // Si no hay errores, crear el usuario
    if (!errors.nombre && !errors.usuario && !errors.password) {
      setIsSubmitting(true);
      setSubmitStatus({ success: false, error: null });
      
      try {
        // Generar hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

        // Guardar en Firestore con la contraseña hasheada
        const userRef = collection(db, 'users');
        await addDoc(userRef, {
          nombre: newUser.nombre,
          usuario: newUser.usuario,
          password: hashedPassword,
          rol: newUser.role,
          createdAt: new Date()
        });
        
        // Mostrar mensaje de éxito
        setSubmitStatus({ success: true, error: null });
        
        // Limpiar formulario
        setNewUser({ nombre: '', usuario: '', password: '', role: 'admin' });
      } catch (error) {
        console.error('Error al crear usuario:', error);
        setSubmitStatus({ success: false, error: 'Error al crear el usuario. Inténtalo de nuevo.' });
      } finally {
        setIsSubmitting(false);
      }
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
          <h1><FiUserPlus size={24} /> Crear Nuevo Usuario</h1>
          <p>Completa el formulario para crear un nuevo usuario</p>
          <Link href="/settings" className={styles.backLink}>
            <FiArrowLeft size={16} /> Volver a los usuarios
          </Link>
        </div>
        
        <div className={styles.settingsSection}>
          <form className={styles.settingsForm} onSubmit={handleCreateUser}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">
                <FiUser size={18} /> Nombre
              </label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={newUser.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa nombre completo"
                className={formErrors.nombre ? styles.inputError : ''}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="usuario">
                <FiUser size={18} /> Usuario
              </label>
              <input 
                type="text" 
                id="usuario" 
                name="usuario" 
                value={newUser.usuario}
                onChange={handleInputChange}
                placeholder="Ingresa nombre de usuario o email"
                className={formErrors.usuario ? styles.inputError : ''}
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">
                <FiLock size={18} /> Contraseña
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Ingresa contraseña"
                className={formErrors.password ? styles.inputError : ''}
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="role">
                <FiUser size={18} /> Rol
              </label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className={styles.roleSelect}
                disabled={isSubmitting}
              >
                <option value="admin">admin</option>
                <option value="visualizador">visualizador</option>
              </select>
            </div>
            
            {submitStatus.success && (
              <div className={styles.successMessage}>
                Usuario creado correctamente
              </div>
            )}
            
            {submitStatus.error && (
              <div className={styles.errorMessage}>
                {submitStatus.error}
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.createButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}