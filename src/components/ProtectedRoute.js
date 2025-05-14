"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirigir inmediatamente si no hay usuario y no estamos en login
  useEffect(() => {
    if (pathname !== '/login' && !localStorage.getItem('user')) {
      router.replace('/login');
    }
  }, [pathname, router]);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        // Si ya estamos en la página de login, permitir acceso
        if (pathname === '/login') {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        // Verificar autenticación antes de cualquier renderizado
        const user = localStorage.getItem('user');
        if (!user) {
          setIsAuthenticated(false);
          setLoading(false);
          router.replace('/login');
          return;
        }

        // El usuario existe, verificar datos

        // Verificar permisos para la página de configuración
        const userData = JSON.parse(user);
        if (pathname.startsWith('/settings') && userData.role !== 'admin') {
          setIsAuthenticated(false);
          router.replace('/');
          return;
        }
        
        // Usuario autenticado y con permisos adecuados
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Solo mostrar contenido si está autenticado y no está cargando
  if (!isAuthenticated && !loading && pathname !== '/login') {
    router.replace('/login');
    return null;
  }

  return isAuthenticated ? children : null;
}