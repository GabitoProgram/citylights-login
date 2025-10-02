# 🔐 CityLights Auth Service

![Auth Service](https://img.shields.io/badge/Microservice-Authentication-green?style=for-the-badge&logo=nestjs)
![NestJS](https://img.shields.io/badge/NestJS-v10.0.0-red?style=for-the-badge&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-v5.6.0-darkblue?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)
![Production](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)

**Servicio de autenticación y gestión de usuarios para el ecosistema CityLights** - Sistema completo de autenticación con roles jerárquicos, verificación por email, JWT tokens, y gestión de avatares con un sofisticado sistema de permisos.

---

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [✨ Características](#-características)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [📡 API Endpoints](#-api-endpoints)
- [👥 Sistema de Roles](#-sistema-de-roles)
- [🔐 Seguridad](#-seguridad)
- [🛠️ Guía para Desarrolladores](#️-guía-para-desarrolladores)
- [🐳 Docker](#-docker)
- [🌍 Despliegue](#-despliegue)
- [🧪 Testing](#-testing)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🏗️ Arquitectura

### Diagrama de Arquitectura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gateway       │    │    Frontend     │    │   Mobile Apps   │
│  Port: 8080     │    │   React App     │    │   React Native  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    CityLights Auth        │
                    │   🔐 Authentication       │
                    │     Port: 3001            │
                    │  ┌─────────────────────┐  │
                    │  │  JWT Management     │  │
                    │  │  Role-based Access  │  │
                    │  │  Email Verification │  │
                    │  │  Password Security  │  │
                    │  │  Avatar Management  │  │
                    │  │  User Hierarchy     │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │  PostgreSQL DB  │
                         │   Neon Database │
                         │                 │
                         │ • Users         │
                         │ • Roles         │
                         │ • Permissions   │
                         │ • Tokens        │
                         │ • Logs          │
                         │ • Verifications │
                         └─────────────────┘
```

### Componentes Principales

#### 🔐 Auth Module
- **Autenticación JWT** con refresh tokens
- **Verificación por email** con códigos temporales
- **Recuperación de contraseña** segura
- **Login logging** detallado

#### 👤 Users Module
- **Gestión de usuarios** con roles jerárquicos
- **CRUD completo** de usuarios
- **Sistema de permisos** granular
- **Paginación** de listados

#### 📧 Email Module
- **Envío de emails** con Nodemailer
- **Templates HTML** personalizados
- **Verificación de cuenta** automática
- **Reset de contraseña** por email

#### 📁 Upload Module
- **Gestión de avatares** con Sharp
- **Optimización de imágenes** automática
- **Almacenamiento local** y validaciones
- **Eliminación segura** de archivos

---

## ✨ Características

### 🔒 Autenticación & Seguridad
- ✅ **JWT Authentication** - Tokens seguros con expiración configurable
- ✅ **Refresh Tokens** - Renovación automática de sesiones
- ✅ **Password Hashing** - Bcrypt con salt rounds configurables
- ✅ **Email Verification** - Códigos de 6 dígitos con expiración
- ✅ **Password Reset** - Recuperación segura por email
- ✅ **Rate Limiting** - Protección contra ataques de fuerza bruta

### 👥 Sistema de Roles Jerárquicos
- ✅ **SUPER_USER** - Control total del sistema
- ✅ **USER_ADMIN** - Gestión de usuarios casuales
- ✅ **USER_CASUAL** - Usuario final con permisos limitados
- ✅ **Role Inheritance** - Permisos heredados por jerarquía
- ✅ **Creation Tracking** - Auditoría de quién creó cada usuario

### 📧 Gestión de Emails
- ✅ **SMTP Integration** - Compatible con Gmail, Outlook, etc.
- ✅ **HTML Templates** - Emails responsivos y atractivos
- ✅ **Verification Codes** - Códigos de 6 dígitos seguros
- ✅ **Email Queue** - Envío asíncrono y resistente a fallos
- ✅ **Development Mode** - Logs en consola para desarrollo

### 📸 Gestión de Avatares
- ✅ **Image Upload** - Subida segura de imágenes
- ✅ **Image Processing** - Redimensionado automático con Sharp
- ✅ **Format Validation** - Solo JPEG, PNG, WebP
- ✅ **Size Limits** - Máximo 5MB por imagen
- ✅ **Secure Storage** - Almacenamiento con nombres únicos

### 📊 Logging & Auditoría
- ✅ **Login Tracking** - Registro detallado de accesos
- ✅ **IP Tracking** - Seguimiento de ubicaciones de acceso
- ✅ **User Agent Logging** - Identificación de dispositivos
- ✅ **Activity Logs** - Auditoría completa de acciones
- ✅ **Performance Metrics** - Monitoreo de rendimiento

---

## 🚀 Instalación

### Requisitos Previos
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 13.0.0
- **Git** para clonado del repositorio

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/GabitoProgram/citylights-login.git
cd citylights-login

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones (ver sección Configuración)

# Configurar base de datos
npx prisma generate
npx prisma db push

# Ejecutar en modo desarrollo
npm run start:dev

# O ejecutar en modo producción
npm run build
npm run start:prod
```

### Verificación de Instalación

```bash
# Verificar que el servicio esté funcionando
curl http://localhost:3001/api/auth/health

# Test de registro
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## ⚙️ Configuración

### Variables de Entorno

```env
# Configuración del Servidor
PORT=3001
NODE_ENV=production

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/citylights_auth?schema=public"

# JWT Configuration
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
EMAIL_FROM="CityLights <no-reply@citylights.com>"

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://citylights-frontend.vercel.app

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpeg,jpg,png,webp

# Development Settings
DISABLE_EMAIL_SENDING=false
LOG_LEVEL=info
```

### Base de Datos con Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar cambios al esquema
npx prisma db push

# Ver base de datos en Prisma Studio
npx prisma studio

# Migración para producción
npx prisma migrate deploy
```

---

## 📡 API Endpoints

### 🔐 Autenticación (Sin autenticación requerida)

#### POST `/api/auth/register`
**Descripción:** Registrar nuevo usuario casual
```bash
curl -X POST "https://auth-service.railway.app/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente. Verifica tu email.",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "USER_CASUAL",
    "status": "PENDING_VERIFICATION"
  }
}
```

#### POST `/api/auth/login`
**Descripción:** Autenticar usuario
```bash
curl -X POST "https://auth-service.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refreshTokenAqui",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "USER_CASUAL",
    "status": "ACTIVE"
  }
}
```

#### POST `/api/auth/verify-email`
**Descripción:** Verificar email con código de 6 dígitos
```bash
curl -X POST "https://auth-service.railway.app/api/auth/verify-email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "code": "123456"
  }'
```

#### POST `/api/auth/refresh`
**Descripción:** Renovar token de acceso
```bash
curl -X POST "https://auth-service.railway.app/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "tu_refresh_token_aqui"
  }'
```

#### GET `/api/auth/health`
**Descripción:** Verificar estado del servicio
```bash
curl -X GET "https://auth-service.railway.app/api/auth/health"
```

### 👤 Gestión de Usuarios (Requiere autenticación)

#### GET `/api/users/profile`
**Descripción:** Obtener perfil del usuario actual
```bash
curl -X GET "https://auth-service.railway.app/api/users/profile" \
  -H "Authorization: Bearer tu_jwt_token"
```

#### POST `/api/users/create-admin`
**Descripción:** Crear usuario administrador (Solo SUPER_USER)
```bash
curl -X POST "https://auth-service.railway.app/api/users/create-admin" \
  -H "Authorization: Bearer super_user_token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "adminPassword123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

#### GET `/api/users/list`
**Descripción:** Listar usuarios con paginación (SUPER_USER y USER_ADMIN)
```bash
curl -X GET "https://auth-service.railway.app/api/users/list?page=1&limit=10" \
  -H "Authorization: Bearer admin_token"
```

### 📁 Gestión de Avatares (Requiere autenticación)

#### POST `/api/upload/avatar`
**Descripción:** Subir avatar del usuario
```bash
curl -X POST "https://auth-service.railway.app/api/upload/avatar" \
  -H "Authorization: Bearer tu_jwt_token" \
  -F "avatar=@/path/to/image.jpg"
```

#### DELETE `/api/upload/avatar`
**Descripción:** Eliminar avatar del usuario
```bash
curl -X DELETE "https://auth-service.railway.app/api/upload/avatar" \
  -H "Authorization: Bearer tu_jwt_token"
```

---

## 👥 Sistema de Roles

### Jerarquía de Roles

```
┌─────────────────┐
│   SUPER_USER    │ ← Máximo control del sistema
│                 │
│ Puede crear:    │
│ • USER_ADMIN    │
│ • SUPER_USER    │
│ • Ver todo      │
└─────────┬───────┘
          │
┌─────────▼───────┐
│   USER_ADMIN    │ ← Gestión de usuarios
│                 │
│ Puede crear:    │
│ • USER_CASUAL   │ (Solo ver, no crear)
│ • Ver usuarios  │
└─────────┬───────┘
          │
┌─────────▼───────┐
│   USER_CASUAL   │ ← Usuario final
│                 │
│ Puede:          │
│ • Ver su perfil │
│ • Cambiar datos │
│ • Usar sistema  │
└─────────────────┘
```

### Permisos por Rol

#### 🔴 SUPER_USER
**Permisos Completos:**
- ✅ Crear USER_ADMIN y SUPER_USER
- ✅ Ver todos los usuarios del sistema
- ✅ Acceder a todos los endpoints protegidos
- ✅ Gestión completa de usuarios
- ✅ Acceso a logs y auditorías

#### 🟡 USER_ADMIN
**Permisos Intermedios:**
- ✅ Ver listado de usuarios con paginación
- ✅ Gestionar usuarios casuales (solo ver)
- ✅ Acceder a funciones administrativas limitadas
- ✅ Ver su propio perfil y modificarlo

#### 🟢 USER_CASUAL
**Permisos Básicos:**
- ✅ Registro público disponible
- ✅ Ver y modificar su propio perfil
- ✅ Subir y cambiar avatar
- ✅ Cambiar contraseña
- ✅ Usar funcionalidades del sistema

---

## 🔐 Seguridad

### JWT Configuration

```typescript
// Configuración JWT
{
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  algorithm: 'HS256'
}

// Payload del token
{
  sub: user.id,           // User ID
  email: user.email,      // Email del usuario
  role: user.role,        // Rol del usuario
  firstName: user.firstName,
  lastName: user.lastName,
  iat: 1642684800,       // Issued at
  exp: 1642771200        // Expires at
}
```

### Password Security

```typescript
// Hashing con bcrypt
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Validación de contraseñas
const minLength = 8;
const requireUppercase = true;
const requireNumbers = true;
const requireSpecialChars = false;
```

---

## 🛠️ Guía para Desarrolladores

### Desarrollo Local

#### 1. Configuración del Entorno

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno para desarrollo local
cat > .env << EOF
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/citylights_auth_dev"
JWT_SECRET=desarrollo_jwt_secret_muy_largo_y_seguro
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
EMAIL_FROM="CityLights Dev <dev@citylights.com>"
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
DISABLE_EMAIL_SENDING=true
LOG_LEVEL=debug
EOF
```

#### 2. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb citylights_auth_dev

# Generar cliente Prisma
npx prisma generate

# Aplicar esquema
npx prisma db push

# Ver datos en Prisma Studio (opcional)
npx prisma studio
```

#### 3. Ejecutar en Modo Desarrollo

```bash
# Ejecutar con hot reload
npm run start:dev

# El servicio estará disponible en http://localhost:3001
```

---

## 🌍 Despliegue

### Railway (Recomendado)

#### 1. Configuración en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login en Railway
railway login

# Crear nuevo proyecto
railway new

# Configurar variables de entorno
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tu_jwt_secret_super_seguro
railway variables set EMAIL_HOST=smtp.gmail.com
railway variables set EMAIL_USER=tu-email@gmail.com
railway variables set EMAIL_PASS=tu-app-password

# Agregar PostgreSQL
railway add postgresql

# Desplegar
railway up
```

#### 2. Variables de Entorno en Railway

```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu_jwt_secret_super_seguro_de_al_menos_32_caracteres
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
EMAIL_FROM="CityLights <no-reply@citylights.com>"
CORS_ORIGINS=https://citylights-frontend.vercel.app,https://citylights-gateway.railway.app
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpeg,jpg,png,webp
LOG_LEVEL=info
```

---

## 🧪 Testing

### Estrategia de Testing

#### 1. Unit Tests

```bash
# Ejecutar todos los tests
npm run test

# Tests con watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

#### 2. Integration Tests

```bash
# Tests end-to-end
npm run test:e2e

# Test específico
npm run test auth.service.spec.ts
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error "Database connection failed"

**Síntoma:** `Error: Can't reach database server`

**Soluciones:**
```bash
# Verificar conexión a la base de datos
npx prisma db push

# Verificar URL de conexión
echo $DATABASE_URL

# Regenerar cliente Prisma
npx prisma generate
```

#### 2. Error "JWT secret not configured"

**Síntoma:** `Error: JWT secret is not defined`

**Solución:**
```bash
# Verificar variable de entorno
echo $JWT_SECRET

# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. Emails no se envían

**Síntoma:** Códigos de verificación no llegan

**Soluciones:**
```bash
# Habilitar modo desarrollo
railway variables set DISABLE_EMAIL_SENDING=true

# Verificar configuración SMTP
curl -v telnet://smtp.gmail.com:587
```

---

## 📞 Soporte

### Contacto del Equipo

- **Desarrollador Principal:** [Tu Nombre]
- **Email:** [tu-email@empresa.com]
- **Slack:** [#citylights-auth]

### Enlaces Útiles

- 🌐 **Auth Service Production:** https://citylights-auth.railway.app
- 📊 **Monitoring Dashboard:** https://railway.app/dashboard
- 🐛 **Issue Tracker:** https://github.com/GabitoProgram/citylights-login/issues
- 📚 **NestJS Documentation:** https://docs.nestjs.com
- 🗃️ **Prisma Documentation:** https://www.prisma.io/docs

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📈 Changelog

### v1.0.0 (2024-01-15)
- ✅ Sistema de autenticación JWT completo
- ✅ Roles jerárquicos (SUPER_USER, USER_ADMIN, USER_CASUAL)
- ✅ Verificación por email con códigos de 6 dígitos
- ✅ Recuperación de contraseña segura
- ✅ Gestión de avatares con optimización de imágenes
- ✅ Refresh tokens para sesiones persistentes
- ✅ Logging detallado de accesos y actividades
- ✅ Rate limiting y protecciones de seguridad
- ✅ API RESTful completa con documentación
- ✅ Despliegue en Railway con PostgreSQL
- ✅ Testing unitario e integración
- ✅ Docker support completo

---

**🌟 ¡Gracias por usar CityLights Auth Service! 🌟**

> Para más información sobre el ecosistema completo de CityLights, visita nuestros otros repositorios:
> - 🌐 [Gateway](https://github.com/GabitoProgram/citylights-gateway)
> - 🏠 [Frontend](https://github.com/GabitoProgram/citylights-frontend)
> - 🏨 [Booking Service](https://github.com/GabitoProgram/citylights-booking)
> - 💼 [Nomina Service](https://github.com/GabitoProgram/citylights-nomina)