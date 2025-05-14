"use client";
import styles from "./dashboard.module.css";
import { FiHome, FiFileText, FiSettings, FiSearch, FiEdit, FiCalendar, FiCheckCircle, FiClock, FiX, FiEye, FiLogOut } from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Función para filtrar posts
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  // Obtener información del usuario al cargar el componente
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsRef);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Error al obtener los posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
            <li className={styles.active}>
              <Link href="/"><FiHome size={18} /> Dashboard</Link>
            </li>
            
            <li>
              <Link href="/settings"><FiSettings size={18} /> Settings</Link>
            </li>
          </ul>
          <div className={styles.logoutSection}>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }} 
              className={styles.logoutButton}
            >
              <FiLogOut size={18} /> Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Toolbar */}
        <header className={styles.toolbar}>
          <div className={styles.searchBar}>
            <FiSearch size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: 'var(--dark-text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser?.name || currentUser?.username || 'Usuario'}</span>
              <span className={styles.userRole}>{currentUser?.role || 'Sin rol'}</span>
            </div>
            <div className={styles.userAvatar}>
              <span>{currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}</span>
            </div>
          </div>
        </header>

        {/* Posts Content */}
        <div className={styles.postsContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <p>Cargando posts...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.postsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Fecha de Publicación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyState}>
                        {searchTerm ? 'No se encontraron posts que coincidan con la búsqueda' : 'No hay posts disponibles'}
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.id.substring(0, 7)}...</td>
                        <td>{post.title.length > 10 ? `${post.title.substring(0, 10)}...` : post.title}</td>
                        <td>
                          <span className={`${styles.postStatus} ${post.status === 'Published' ? styles.published : styles.scheduled}`}>
                            {post.status}
                          </span>
                        </td>
                        <td>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        }) : 'No disponible'}</td>
                        <td className={styles.actionButtons}>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setIsModalOpen(true);
                            }}
                            className={styles.actionButton}
                          >
                            <FiEye size={14} /> Ver
                          </button>
                          {currentUser?.role === 'admin' && (
                            <Link href={`/edit-post?id=${post.id}`} className={styles.actionButton}>
                              <FiEdit size={14} /> Editar
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Botón de Agregar Publicación */}
                {currentUser?.role === 'admin' && (
          <div className={styles.addButtonContainer}>
            <a href="/create-post" className={styles.addButton}>
              <FiEdit size={16} /> Agregar publicación
            </a>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <div className={styles.modalBody}>
              <h2>{selectedPost.title}</h2>
              <div className={styles.postAuthor}>
                <strong>Autor:</strong> {selectedPost.authorName || 'Anónimo'}
              </div>
              <div className={styles.postDescription}>
                <strong>Descripción:</strong>
                <p>{selectedPost.description}</p>
              </div>
              <div className={styles.postMetadata}>
                <strong>Detalles de la publicación</strong>
                <p>Estado: {selectedPost.status}</p>
                <p>Fecha de creación: {selectedPost.createdAt ? new Date(selectedPost.createdAt.toDate()).toLocaleDateString('es-ES', { 
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No disponible'}</p>
              </div>
              {Array.isArray(selectedPost.tags) && selectedPost.tags.length > 0 && (
                <div className={styles.postTags}>
                  <strong>Etiquetas</strong>
                  <p>{selectedPost.tags.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

