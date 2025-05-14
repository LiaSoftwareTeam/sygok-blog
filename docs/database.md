# Documentación de Base de Datos

## Firebase Firestore

La aplicación utiliza Firebase Firestore como base de datos principal, aprovechando su naturaleza NoSQL y capacidades en tiempo real para gestionar posts y usuarios del blog.

## Estructura de Datos

### Colección: `users`

```javascript
{
  uid: string,          // ID único del usuario (generado por Firebase Auth)
  email: string,        // Correo electrónico del usuario
  role: string,         // Role del usuario ('admin' o 'viewer')
  name: string,         // Nombre completo del usuario
  createdAt: timestamp, // Fecha de creación del usuario
  lastLogin: timestamp  // Último inicio de sesión
}
```

### Colección: `posts`

```javascript
{
  id: string,           // ID único del post
  title: string,        // Título del post
  content: string,      // Contenido del post (HTML/Markdown)
  author: {             // Información del autor
    uid: string,        // ID del autor
    name: string        // Nombre del autor
  },
  status: string,       // Estado del post ('draft', 'published')
  publishedAt: timestamp,// Fecha de publicación
  updatedAt: timestamp, // Fecha de última actualización
  tags: array,          // Etiquetas del post
  metadata: {           // Metadatos adicionales
    views: number,      // Número de vistas
    readTime: number    // Tiempo estimado de lectura
  }
}
```

## Operaciones Principales

### Usuarios

1. **Crear Usuario**
   - Registro en Firebase Auth
   - Creación de documento en colección `users`
   - Asignación de rol inicial

2. **Actualizar Usuario**
   - Modificación de roles y permisos
   - Actualización de información personal

3. **Consultar Usuarios**
   - Listado de usuarios por rol
   - Búsqueda por email o nombre

### Posts

1. **Crear Post**
   - Generación de ID único
   - Almacenamiento de contenido y metadata
   - Registro de autor y timestamp

2. **Actualizar Post**
   - Modificación de contenido
   - Actualización de estado y metadata
   - Registro de cambios

3. **Consultar Posts**
   - Filtrado por estado y tags
   - Ordenamiento por fecha
   - Paginación de resultados

## Índices y Consultas

### Índices Compuestos

- `posts`: status, publishedAt (para listar posts publicados)
- `posts`: author.uid, updatedAt (para posts por autor)
- `users`: role, createdAt (para listar usuarios por rol)

### Consultas Optimizadas

```javascript
// Ejemplo de consulta para posts publicados
db.collection('posts')
  .where('status', '==', 'published')
  .orderBy('publishedAt', 'desc')
  .limit(10)

// Ejemplo de consulta para usuarios admin
db.collection('users')
  .where('role', '==', 'admin')
  .orderBy('createdAt', 'desc')
```

## Seguridad

### Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Reglas para usuarios
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Respaldo y Recuperación

- Exportación automática diaria de datos
- Retención de backups por 30 días
- Proceso de restauración documentado
- Pruebas periódicas de recuperación