# Guía de Inicio Rápido

## Introducción

Esta guía te ayudará a configurar y ejecutar el Blog Admin en tu entorno local de desarrollo.

## Requisitos del Sistema

- Node.js (v18 o superior)
- npm o yarn
- Git
- Cuenta de Firebase

## Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <url-repositorio>
cd blog-santana
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crear un nuevo proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication y Firestore
3. Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Desarrollo Local

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Cuenta de Administrador Inicial

1. Registrar una cuenta nueva
2. Usar Firebase Console para asignar rol de administrador
3. Iniciar sesión con las credenciales creadas

## Estructura del Proyecto

```
blog-santana/
├── src/
│   ├── app/              # Rutas y componentes principales
│   ├── components/       # Componentes reutilizables
│   └── firebase/        # Configuración de Firebase
├── public/              # Archivos estáticos
└── docs/               # Documentación
```

## Flujo de Trabajo Básico

### 1. Gestión de Posts

- Crear nuevo post: `/create-post`
- Editar post existente: `/edit-post/[id]`
- Ver lista de posts: `/`

### 2. Administración de Usuarios

- Gestionar usuarios: `/settings`
- Asignar roles: Sección de configuración

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

## Solución de Problemas Comunes

### Error de Autenticación

1. Verificar credenciales de Firebase
2. Comprobar variables de entorno
3. Revisar permisos de usuario

### Problemas de Compilación

1. Limpiar cache: `npm clean cache --force`
2. Eliminar node_modules: `rm -rf node_modules`
3. Reinstalar dependencias: `npm install`

## Siguientes Pasos

1. Revisar la [Documentación de Arquitectura](./architecture.md)
2. Explorar la [Documentación de la Base de Datos](./database.md)
3. Consultar la [Guía de Autenticación](./auth.md)
4. Leer la [Guía de Despliegue](./deployment.md)

## Soporte

Para problemas o preguntas:
1. Revisar la documentación existente
2. Consultar los problemas conocidos
3. Crear un nuevo issue en el repositorio