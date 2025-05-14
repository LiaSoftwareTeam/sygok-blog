# Blog Admin - Panel de Administración

Este es un panel de administración para un blog desarrollado con Next.js y Firebase. Permite gestionar posts y usuarios con diferentes roles de acceso.

## Características Principales

- **Autenticación de Usuarios**: Sistema de login seguro con contraseñas hasheadas
- **Gestión de Posts**: Crear, editar y administrar publicaciones del blog
- **Gestión de Usuarios**: Administración de usuarios con diferentes roles (admin, visualizador)
- **Interfaz Moderna**: Diseño responsivo y amigable usando CSS Modules
- **Base de Datos en Tiempo Real**: Integración con Firebase Firestore

## Tecnologías Utilizadas

- **Frontend**: 
  - Next.js 14 (App Router)
  - React.js
  - CSS Modules
  - React Icons

- **Backend/Base de Datos**:
  - Firebase Firestore
  - Firebase Authentication

- **Seguridad**:
  - bcryptjs para hash de contraseñas
  - Protección de rutas por roles

## Estructura del Proyecto

```
blog-santana/
├── src/
│   ├── app/                    # Rutas y componentes principales
│   │   ├── components/         # Componentes reutilizables
│   │   ├── create-post/        # Página de creación de posts
│   │   ├── edit-post/          # Página de edición de posts
│   │   ├── login/              # Página de inicio de sesión
│   │   ├── settings/           # Configuración y gestión de usuarios
│   │   └── page.js             # Página principal/dashboard
│   ├── components/             # Componentes globales
│   └── firebase/               # Configuración de Firebase
├── public/                     # Archivos estáticos
└── docs/                       # Documentación del proyecto
```

## Enlaces a Documentación Detallada

- [Guía de Inicio Rápido](./getting-started.md)
- [Arquitectura del Sistema](./architecture.md)
- [Base de Datos](./database.md)
- [Autenticación](./auth.md)
- [Despliegue](./deployment.md)
- [Solución de Problemas](./troubleshooting.md)
- [Guía de Contribución](./contributing.md)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](../LICENSE) para más detalles.