# 🧪 Guía de Pruebas con Insomnia - CITYLIGHTS Auth Service

## 🎯 Configuración Inicial en Insomnia

### 1. **Crear Nueva Request Collection**
- Abre Insomnia
- Crea una nueva colección llamada "CITYLIGHTS Auth Service"
- Base URL: `http://localhost:3001`

---

## 📝 PASO 1: Registrar Nuevo Usuario

### **Request: Registro de Usuario**
```
Método: POST
URL: http://localhost:3001/api/auth/register
Headers: Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "testuser@citylights.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "...",
    "email": "testuser@citylights.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER_CASUAL",
    "status": "PENDING_VERIFICATION",
    "avatarUrl": null
  }
}
```

📧 **El sistema enviará un email de verificación automáticamente**

---

## 📝 PASO 2: Verificar Email (Opcional)

### **Request: Verificar Email**
```
Método: POST
URL: http://localhost:3001/api/auth/verify-email
Headers: Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "testuser@citylights.com",
  "code": "CÓDIGO_DEL_EMAIL"
}
```

📧 **Revisa el email que llegó a testuser@citylights.com para obtener el código**

---

## 📝 PASO 3: Iniciar Sesión

### **Request: Login**
```
Método: POST
URL: http://localhost:3001/api/auth/login
Headers: Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "testuser@citylights.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "...",
    "email": "testuser@citylights.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER_CASUAL",
    "avatarUrl": null
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

🔑 **IMPORTANTE: Copia el `accessToken` para los siguientes pasos**

---

## 📝 PASO 4: Ver Perfil (Sin Avatar)

### **Request: Ver Perfil**
```
Método: GET
URL: http://localhost:3001/api/users/profile
Headers: 
  - Authorization: Bearer TU_ACCESS_TOKEN_AQUÍ
```

**Respuesta esperada:**
```json
{
  "id": "...",
  "email": "testuser@citylights.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "USER_CASUAL",
  "status": "ACTIVE",
  "avatarUrl": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 🖼️ PASO 5: Subir Avatar

### **Request: Upload Avatar**
```
Método: POST
URL: http://localhost:3001/api/upload/avatar
Headers: 
  - Authorization: Bearer TU_ACCESS_TOKEN_AQUÍ
Body: Multipart Form
```

**Body (Multipart Form):**
- Field name: `avatar`
- Type: File
- Archivo: Selecciona una imagen JPG o PNG (máximo 5MB)

**Respuesta esperada:**
```json
{
  "message": "Avatar subido exitosamente",
  "avatarUrl": "http://localhost:3001/api/upload/avatar/uuid-filename.jpg",
  "user": {
    "id": "...",
    "avatarUrl": "uuid-filename.jpg"
  }
}
```

---

## 📝 PASO 6: Ver Perfil (Con Avatar)

### **Request: Ver Perfil Actualizado**
```
Método: GET
URL: http://localhost:3001/api/users/profile
Headers: 
  - Authorization: Bearer TU_ACCESS_TOKEN_AQUÍ
```

**Respuesta esperada:**
```json
{
  "id": "...",
  "email": "testuser@citylights.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "USER_CASUAL",
  "status": "ACTIVE",
  "avatarUrl": "uuid-filename.jpg",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 🖼️ PASO 7: Ver Avatar en el Navegador

### **Request: Ver Avatar**
```
Método: GET
URL: http://localhost:3001/api/upload/avatar/uuid-filename.jpg
Headers: Ninguno (público)
```

💡 **También puedes abrir esta URL directamente en tu navegador**

---

## 📊 PASO 8: Ver Estadísticas

### **Request: Estadísticas de Upload**
```
Método: DELETE
URL: http://localhost:3001/api/upload/stats
Headers: 
  - Authorization: Bearer TU_ACCESS_TOKEN_AQUÍ
```

**Respuesta esperada:**
```json
{
  "totalUploads": 1,
  "usersWithAvatar": 1,
  "recentUploads": [
    {
      "userId": "...",
      "fileName": "uuid-filename.jpg",
      "uploadedAt": "..."
    }
  ]
}
```

---

## 🗑️ PASO 9: Eliminar Avatar

### **Request: Eliminar Avatar**
```
Método: DELETE
URL: http://localhost:3001/api/upload/avatar
Headers: 
  - Authorization: Bearer TU_ACCESS_TOKEN_AQUÍ
```

**Respuesta esperada:**
```json
{
  "message": "Avatar eliminado exitosamente",
  "user": {
    "id": "...",
    "avatarUrl": null
  }
}
```

---

## 🔧 Tips para Insomnia

### **Variables de Entorno**
Crea estas variables en Insomnia:
- `base_url`: `http://localhost:3001`
- `access_token`: (actualizar después del login)

### **Headers Template**
Para requests autenticados:
```
Authorization: Bearer {{ _.access_token }}
```

### **Casos de Prueba Adicionales**

1. **Subir archivo muy grande** (>5MB) - Debe fallar
2. **Subir archivo no válido** (PDF, TXT) - Debe fallar
3. **Subir sin token** - Debe fallar con 401
4. **Eliminar avatar inexistente** - Debe fallar apropiadamente

---

## 🎯 Flujo Completo de Prueba

1. ✅ Registrar usuario
2. ✅ Verificar email (opcional)
3. ✅ Login → Obtener token
4. ✅ Ver perfil sin avatar
5. ✅ Subir avatar
6. ✅ Ver perfil con avatar
7. ✅ Ver imagen en navegador
8. ✅ Ver estadísticas
9. ✅ Eliminar avatar

**¡Todo listo para probar en Insomnia!** 🚀