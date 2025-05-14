# Documentación de Autenticación

## Sistema de Autenticación

El Blog Admin implementa un sistema de autenticación robusto utilizando Firebase Authentication en conjunto con bcryptjs para el manejo seguro de contraseñas.

## Flujo de Autenticación

### Inicio de Sesión

1. **Proceso de Login**
   - Usuario ingresa credenciales (email/contraseña)
   - Validación inicial en el cliente
   - Autenticación con Firebase Auth
   - Verificación de rol y permisos
   - Generación de token de sesión

2. **Manejo de Sesión**
   - Almacenamiento seguro del token
   - Verificación automática del estado de sesión
   - Renovación de tokens
   - Cierre de sesión controlado

## Roles y Permisos

### Tipos de Usuarios

1. **Administrador**
   - Acceso completo al sistema
   - Gestión de usuarios
   - Creación y edición de posts
   - Configuración del sistema

2. **Visualizador**
   - Acceso de solo lectura
   - Visualización de posts
   - Sin permisos de edición

### Matriz de Permisos

| Funcionalidad           | Admin | Visualizador |
|------------------------|-------|---------------|
| Ver posts              | ✓     | ✓            |
| Crear posts            | ✓     | ✗            |
| Editar posts           | ✓     | ✗            |
| Eliminar posts         | ✓     | ✗            |
| Gestionar usuarios     | ✓     | ✗            |
| Ver configuración      | ✓     | ✓            |
| Modificar configuración| ✓     | ✗            |

## Implementación de Seguridad

### Protección de Rutas

```javascript
// Ejemplo de middleware de protección de rutas
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('No token provided');

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) throw new Error('User not found');
    
    req.user = {
      ...decodedToken,
      role: userDoc.data().role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### Validación de Permisos

```javascript
// Ejemplo de verificación de rol de administrador
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

## Gestión de Contraseñas

### Hasheo de Contraseñas

- Utilización de bcryptjs para hash seguro
- Salt rounds configurables
- Almacenamiento seguro en Firebase Auth

### Políticas de Contraseñas

- Mínimo 8 caracteres
- Combinación de mayúsculas y minúsculas
- Al menos un número
- Al menos un carácter especial
- No permitir contraseñas comunes

## Auditoría y Monitoreo

### Registro de Actividades

- Login exitosos y fallidos
- Cambios de contraseña
- Modificaciones de permisos
- Acciones administrativas

### Alertas de Seguridad

- Intentos de acceso fallidos múltiples
- Accesos desde ubicaciones inusuales
- Cambios en roles de usuario
- Actividades sospechosas

## Recuperación de Cuenta

### Proceso de Recuperación

1. Solicitud de restablecimiento
2. Verificación de email
3. Token temporal de recuperación
4. Validación de nueva contraseña
5. Notificación de cambio exitoso

## Mejores Prácticas

1. **Seguridad**
   - Tokens JWT con expiración corta
   - Rotación regular de claves
   - Validación de entrada estricta

2. **UX**
   - Mensajes de error claros
   - Proceso de login intuitivo
   - Feedback visual apropiado

3. **Mantenimiento**
   - Monitoreo continuo
   - Actualizaciones regulares
   - Backups de configuración