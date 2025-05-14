"use client";
import React, { useState, useEffect, Suspense } from 'react';
import styles from '../create-post/create-post.module.css';
import { FiFileText, FiEdit, FiLink, FiImage, FiUpload, FiTag, FiList, FiArrowLeft } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function EditPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    links: '',
    tags: '',
    category: 'general',
    urlImage: '',
    status: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });

  // Verificar permisos de usuario
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

  useEffect(() => {
    // Cargar los datos del post
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setFormData({
            title: postData.title || '',
            description: postData.description || '',
            links: postData.links || '',
            tags: postData.tags || '',
            category: postData.category || 'general',
            urlImage: postData.urlImage || 'https://via.placeholder.com/800x400',
            status: postData.status || 'Published'
          });
        } else {
          console.error('No se encontró el post');
          router.push('/');
        }
      } catch (error) {
        console.error('Error al cargar el post:', error);
        setSubmitStatus({
          success: false,
          error: 'Error al cargar el post. Por favor, inténtalo de nuevo.'
        });
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: null });

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...formData,
        updatedAt: new Date()
      });

      setSubmitStatus({ success: true, error: null });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      console.error('Error al actualizar el post:', error);
      setSubmitStatus({
        success: false,
        error: 'Error al actualizar el post. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.createPostContainer} ${styles.variables}`}>
      <div className={styles.createPostCard}>
        <div className={styles.createPostHeader}>
          <h1><FiEdit size={24} /> Editar Post</h1>
          <p>Modifica los detalles del post</p>
          <Link href="/" className={styles.backLink}>
            <FiArrowLeft size={16} /> Volver al dashboard
          </Link>
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
            >
              <option value="general">General</option>
              <option value="tecnologia">Tecnología</option>
              <option value="diseño">Diseño</option>
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
            >
              <option value="Published">Publicado</option>
              <option value="Draft">Borrador</option>
            </select>
          </div>

          {submitStatus.success && (
            <div className={styles.successMessage}>
              Post actualizado correctamente
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
            {isSubmitting ? 'Actualizando...' : 'Actualizar Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditPost() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostContent />
    </Suspense>
  );
}