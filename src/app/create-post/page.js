"use client"
import React, { useState, useEffect } from 'react';
import styles from './create-post.module.css';
import { FiFileText, FiEdit, FiLink, FiImage, FiUpload, FiTag, FiList } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const router = useRouter();
  // Estado para almacenar la información del usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  
  // Obtener información del usuario desde localStorage y verificar permisos
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUser(user);
      
      // Redirigir si el usuario no es administrador
      if (user.role !== 'admin') {
        router.push('/');
      }
    } else {
      // Redirigir si no hay usuario autenticado
      router.push('/login');
    }
  }, [router]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    links: '',
    tags: '',
    category: 'general', // Categoría por defecto
    urlImage: 'https://via.placeholder.com/800x400', // URL de imagen por defecto
    authorId: '', // Se establecerá con el ID del usuario actual
    authorName: '', // Se establecerá con el nombre del usuario actual
    status: 'Published' // Estado por defecto: Publicado
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });
  
  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Actualizar el authorId y authorName cuando el usuario actual cambie
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        authorId: currentUser.id,
        authorName: currentUser.name || currentUser.username
      }));
    }
  }, [currentUser]);
  
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: null });
    
    try {
      // Crear un objeto con los datos del post
      const postData = {
        ...formData,
        createdAt: new Date()
      };
      
      // Guardar en Firestore en la colección 'posts'
      const postsRef = collection(db, 'posts');
      const docRef = await addDoc(postsRef, postData);
      
      console.log('Post creado con ID:', docRef.id);
      setSubmitStatus({ success: true, error: null });
      
      // Limpiar el formulario después de 2 segundos y redirigir
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          links: '',
          tags: '',
          category: 'general',
          urlImage: 'https://via.placeholder.com/800x400',
          authorId: currentUser?.id || '',
          authorName: currentUser?.name || currentUser?.username || ''
        });
        router.push('/'); // Redirigir al dashboard
      }, 2000);
      
    } catch (error) {
      console.error('Error al crear el post:', error);
      setSubmitStatus({ 
        success: false, 
        error: 'Error al crear el post. Por favor, inténtalo de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar el drag and drop (solo visual)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragActive);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragActive);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragActive);
    // Solo visual, no hay funcionalidad real de subida
    const dropzone = document.getElementById('dropzone-text');
    dropzone.textContent = 'Esta función no está disponible en este momento';
  };

  // Función para manejar el clic en la zona de dropzone
  const handleClick = () => {
    const dropzone = document.getElementById('dropzone-text');
    dropzone.textContent = 'Esta función no está disponible en este momento';
  };

  return (
    <div className={`${styles.createPostContainer} ${styles.variables}`}>
      <div className={styles.createPostCard}>
        <div className={styles.createPostHeader}>
          <h1><FiEdit size={24} /> Crear Nuevo Post</h1>
          <p>Completa el formulario para crear un nuevo post</p>
        </div>
        
        <form className={styles.createPostForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">
              <FiFileText size={18} /> Título
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="Ingresa el título del post"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">
              <FiEdit size={18} /> Descripción
            </label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Escribe la descripción del post"
              rows="5"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="links">
              <FiLink size={18} /> Enlaces relacionados (opcional)
            </label>
            <input 
              type="url" 
              id="links" 
              name="links" 
              placeholder="https://ejemplo.com"
              value={formData.links}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="tags">
              <FiTag size={18} /> Etiquetas (separadas por comas)
            </label>
            <input 
              type="text" 
              id="tags" 
              name="tags" 
              placeholder="tecnología, programación, diseño"
              value={formData.tags}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">
              <FiList size={18} /> Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.selectInput}
            >
              <option value="general">General</option>
              <option value="tecnologia">Tecnología</option>
              <option value="programacion">Programación</option>
              <option value="diseno">Diseño</option>
              <option value="marketing">Marketing</option>
              <option value="negocios">Negocios</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="status">
              <FiList size={18} /> Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.selectInput}
            >
              <option value="Published">Publicado</option>
              <option value="Draft">Borrador</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="urlImage">
              <FiImage size={18} /> URL de imagen destacada
            </label>
            <input 
              type="url" 
              id="urlImage" 
              name="urlImage" 
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.urlImage}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>
              <FiImage size={18} /> Imagen destacada
            </label>
            <div 
              className={styles.dropzone}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <FiUpload size={32} />
              <p id="dropzone-text">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
              <span className={styles.dropzoneHint}>Solo diseño, sin funcionalidad de subida real</span>
            </div>
          </div>
          
          {submitStatus.success && (
            <div className={styles.successMessage}>
              ¡Post creado correctamente! Redirigiendo...
            </div>
          )}
          
          {submitStatus.error && (
            <div className={styles.errorMessage}>
              {submitStatus.error}
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.publishButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : formData.status === 'Draft' ? 'Guardar como borrador' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
  );
}