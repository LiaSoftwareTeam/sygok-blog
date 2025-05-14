"use client"
import React, { useState } from 'react';
import styles from './login.module.css';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para validar el formulario y autenticar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { username, password } = formData;
    
    // Validación básica
    let isValid = true;
    
    if (!username) {
      e.target.username.classList.add(styles.inputError);
      isValid = false;
    } else {
      e.target.username.classList.remove(styles.inputError);
    }
    
    if (!password) {
      e.target.password.classList.add(styles.inputError);
      isValid = false;
    } else {
      e.target.password.classList.remove(styles.inputError);
    }
    
    if (isValid) {
      try {
        setIsLoading(true);
        
        // Buscar el usuario en Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("usuario", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Usuario no encontrado');
          setIsLoading(false);
          return;
        }
        
        // Verificar la contraseña hasheada
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // Comparar la contraseña ingresada con el hash almacenado
        const passwordMatch = await bcrypt.compare(password, userData.password);
        
        if (!passwordMatch) {
          setError('Contraseña incorrecta');
          setIsLoading(false);
          return;
        }
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          id: userDoc.id,
          username: userData.usuario,
          name: userData.nombre,
          role: userData.rol
        }));
        
        // Redirigir al dashboard
        router.push('/');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`${styles.loginContainer} ${styles.variables}`}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Blog Admin</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <FiAlertCircle size={18} />
            {error}
          </div>
        )}
        
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">
              <FiUser size={18} /> Usuario
            </label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu nombre de usuario"
              disabled={isLoading}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}