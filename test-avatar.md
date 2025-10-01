# Test de Funcionalidad Avatar - CITYLIGHTS Auth Service

## 🎯 Endpoints Disponibles

### 1. Subir Avatar
- **POST** `http://localhost:3001/api/upload/avatar`
- **Headers**: 
  - `Authorization: Bearer <tu_token_jwt>`
  - `Content-Type: multipart/form-data`
- **Body**: 
  - Campo `avatar` con archivo JPG/PNG (máximo 5MB)

### 2. Eliminar Avatar
- **DELETE** `http://localhost:3001/api/upload/avatar`
- **Headers**: 
  - `Authorization: Bearer <tu_token_jwt>`

### 3. Ver Avatar
- **GET** `http://localhost:3001/api/upload/avatar/:filename`
- Sin autenticación requerida

### 4. Estadísticas de Uploads
- **GET** `http://localhost:3001/api/upload/stats`
- **Headers**: 
  - `Authorization: Bearer <tu_token_jwt>`

## ✅ Funcionalidades Implementadas

### Validaciones
- ✅ Solo archivos JPG y PNG
- ✅ Tamaño máximo de 5MB
- ✅ Procesamiento con Sharp para optimización
- ✅ Nombres únicos con UUID

### Seguridad
- ✅ Autenticación JWT requerida
- ✅ Validación de usuario existente
- ✅ Gestión automática de archivos antiguos

### Procesamiento
- ✅ Redimensionado automático (300x300px)
- ✅ Optimización de calidad (80%)
- ✅ Conversión a JPEG para consistencia

### Base de Datos
- ✅ Campo `avatarUrl` en modelo User
- ✅ Actualización automática del perfil
- ✅ Gestión de avatares en endpoints existentes

## 🔗 Flujo de Trabajo

1. **Login** para obtener token JWT
2. **Subir avatar** con token de autenticación
3. **Ver perfil** incluye ahora el `avatarUrl`
4. **Eliminar avatar** cuando sea necesario

## 📁 Estructura de Archivos

```
uploads/
└── avatars/
    ├── uuid1.jpg
    ├── uuid2.jpg
    └── ...
```

Los archivos se procesan automáticamente y se almacenan con nombres únicos para evitar conflictos.

## 🧪 Testing con Insomnia/Postman

1. Usar endpoint de login para obtener token
2. Incluir token en header Authorization
3. Subir archivo usando form-data con campo "avatar"
4. Verificar respuesta con URL del avatar
5. Probar visualización del avatar con GET endpoint