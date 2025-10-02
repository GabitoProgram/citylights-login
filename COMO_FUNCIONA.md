# 🏨 CityLights - Guía Práctica para Desarrolladores

**¡Hola! 👋** Esta es una guía simple para que puedas entender y usar las APIs del sistema CityLights sin complicaciones.

---

## 🎯 ¿Qué es CityLights?

CityLights es un **sistema completo de gestión hotelera** que incluye:
- 🔐 **Autenticación de usuarios** (login, registro, roles)
- 🏨 **Sistema de reservas** (áreas, pagos con Stripe)
- 💼 **Gestión de nómina** (empleados, reportes, PDFs)
- 🌐 **Gateway** (punto de entrada único)
- 🖥️ **Frontend** (interfaz web en React)

---

## 🚀 URLs de Producción (¡FUNCIONANDO AHORA!)

### 🔗 Enlaces Principales
- **🌐 Gateway (Punto de entrada):** https://citylights-gateway-production.up.railway.app
- **🏠 Frontend (Página web):** https://citylights-frontend.vercel.app
- **🔐 Auth Service:** https://citylights-auth-production.up.railway.app
- **🏨 Booking Service:** https://citylights-booking-production.up.railway.app
- **💼 Nomina Service:** https://citylights-nomina-production.up.railway.app

### 📊 Health Checks (Para verificar que funcionen)
```bash
# Verificar que todos los servicios estén funcionando
curl https://citylights-gateway-production.up.railway.app/api/proxy/health
curl https://citylights-auth-production.up.railway.app/api/auth/health
curl https://citylights-booking-production.up.railway.app/api/test/health
curl https://citylights-nomina-production.up.railway.app/api/health
```

---

## 🔐 Cómo Empezar (Paso a Paso)

### 1️⃣ **Registrarse** (Crear cuenta nueva)
```bash
curl -X POST "https://citylights-gateway-production.up.railway.app/api/proxy/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@gmail.com",
    "password": "password123",
    "firstName": "Tu Nombre",
    "lastName": "Tu Apellido"
  }'
```

### 2️⃣ **Verificar Email** 
Después del registro, revisa tu email y usa el código de 6 dígitos:
```bash
curl -X POST "https://citylights-gateway-production.up.railway.app/api/proxy/auth/verify-email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@gmail.com",
    "code": "123456"
  }'
```

### 3️⃣ **Hacer Login** (Obtener token)
```bash
curl -X POST "https://citylights-gateway-production.up.railway.app/api/proxy/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@gmail.com",
    "password": "password123"
  }'
```

**Respuesta:** Te dará un `access_token` que necesitas para todo lo demás.

### 4️⃣ **Usar el Token** en todas las demás peticiones
```bash
# Ejemplo: Ver tu perfil
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/users/profile" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🏨 Sistema de Reservas - APIs Disponibles

### 📍 **Ver Áreas Disponibles**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/api/areas" \
  -H "Authorization: Bearer TU_TOKEN"
```

### 📅 **Crear Reserva**
```bash
curl -X POST "https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/api/reservas" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "areaId": 1,
    "fecha": "2024-12-25",
    "horaInicio": "14:00",
    "horaFin": "16:00",
    "descripcion": "Reunión de trabajo"
  }'
```

### 💳 **Ver Facturas**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/api/facturas" \
  -H "Authorization: Bearer TU_TOKEN"
```

### 📄 **Descargar Factura en PDF**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/factura/ID_FACTURA/descargar" \
  -H "Authorization: Bearer TU_TOKEN" \
  --output factura.pdf
```

---

## 👥 Roles del Sistema

### 🟢 **USER_CASUAL** (Usuarios normales)
- ✅ Puede registrarse libremente
- ✅ Hacer reservas
- ✅ Ver sus facturas
- ✅ Subir avatar
- ❌ No puede ver otros usuarios

### 🟡 **USER_ADMIN** (Administradores)
- ✅ Todo lo de USER_CASUAL
- ✅ Ver lista de usuarios
- ✅ Acceso a reportes
- ❌ Solo puede ser creado por SUPER_USER

### 🔴 **SUPER_USER** (Super administradores)
- ✅ Control total del sistema
- ✅ Crear otros SUPER_USER y USER_ADMIN
- ✅ Acceso a nómina
- ✅ Ver todos los reportes

---

## 💼 Sistema de Nómina (Solo para Admins)

### 👨‍💼 **Ver Empleados**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/nomina/empleados" \
  -H "Authorization: Bearer TU_TOKEN_ADMIN"
```

### 📊 **Descargar Reporte de Nómina (PDF)**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/nomina/reportes/nomina/pdf" \
  -H "Authorization: Bearer TU_TOKEN_ADMIN" \
  --output reporte_nomina.pdf
```

### 📈 **Descargar Reporte de Nómina (Excel)**
```bash
curl -X GET "https://citylights-gateway-production.up.railway.app/api/proxy/nomina/reportes/nomina/excel" \
  -H "Authorization: Bearer TU_TOKEN_ADMIN" \
  --output reporte_nomina.xlsx
```

---

## 📱 Ejemplos Prácticos con JavaScript

### 🔐 **Login Completo**
```javascript
// 1. Hacer login
const loginResponse = await fetch('https://citylights-gateway-production.up.railway.app/api/proxy/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'tu-email@gmail.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.access_token;

// 2. Usar el token para hacer reservas
const reservaResponse = await fetch('https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/api/reservas', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    areaId: 1,
    fecha: '2024-12-25',
    horaInicio: '14:00',
    horaFin: '16:00',
    descripcion: 'Mi reunión'
  })
});

const reserva = await reservaResponse.json();
console.log('Reserva creada:', reserva);
```

### 📄 **Descargar PDF**
```javascript
const token = 'TU_TOKEN_AQUI';
const facturaId = '123';

const response = await fetch(`https://citylights-gateway-production.up.railway.app/api/proxy/booking-copia/factura/${facturaId}/descargar`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'factura.pdf';
a.click();
```

---

## 🛠️ Testing Rápido

### ✅ **Script de Prueba Completo**
```javascript
// testing-citylights.js
const baseURL = 'https://citylights-gateway-production.up.railway.app/api/proxy';

async function testCityLights() {
  try {
    // 1. Health check
    console.log('🔍 Verificando servicios...');
    const health = await fetch(`${baseURL}/health`);
    console.log('✅ Servicios:', await health.json());

    // 2. Registrar usuario
    console.log('📝 Registrando usuario...');
    const register = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    console.log('✅ Registro:', await register.json());

    // 3. Login (después de verificar email)
    console.log('🔐 Haciendo login...');
    const login = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await login.json();
    console.log('✅ Login exitoso, token obtenido');

    // 4. Ver perfil
    const token = loginData.access_token;
    const profile = await fetch(`${baseURL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Perfil:', await profile.json());

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCityLights();
```

---

## 🔑 Datos de Prueba

### 👤 **Usuario de Prueba (ya creado)**
- **Email:** `test@citylights.com`
- **Password:** `password123`
- **Rol:** `USER_CASUAL`

### 🏨 **Áreas de Prueba Disponibles**
- **Área 1:** Sala de Conferencias A
- **Área 2:** Salón de Eventos
- **Área 3:** Sala de Reuniones B

---

## 🚨 Errores Comunes y Soluciones

### ❌ **"Token inválido o expirado"**
**Solución:** Hacer login nuevamente para obtener un token fresco.

### ❌ **"Email ya registrado"**
**Solución:** Usar un email diferente o hacer login con el email existente.

### ❌ **"Usuario no verificado"**
**Solución:** Verificar el email con el código de 6 dígitos enviado.

### ❌ **"No tienes permisos"**
**Solución:** Verificar que tengas el rol correcto (algunas funciones son solo para admins).

---

## 📚 Recursos Adicionales

### 🔗 **Repositorios en GitHub**
- **Frontend:** https://github.com/GabitoProgram/citylights-frontend
- **Gateway:** https://github.com/GabitoProgram/citylights-gateway
- **Auth Service:** https://github.com/GabitoProgram/citylights-login
- **Booking Service:** https://github.com/GabitoProgram/citylights-booking
- **Nomina Service:** https://github.com/GabitoProgram/citylights-nomina

### 🛠️ **Herramientas Recomendadas**
- **Postman:** Para probar las APIs de forma visual
- **Insomnia:** Alternativa a Postman
- **curl:** Para pruebas rápidas en terminal
- **Thunder Client:** Extensión de VS Code

### 📖 **Documentación Técnica Completa**
Si necesitas documentación más técnica, revisa el `README.md` principal de cada repositorio.

---

## 🤝 Contacto

¿Tienes dudas o problemas? 

- **GitHub Issues:** Crear un issue en el repositorio correspondiente
- **Email:** [tu-email@ejemplo.com]
- **Documentación completa:** Ver README.md principal

---

## 🎉 ¡Importante!

✅ **Todos los servicios están en producción y funcionando 24/7**  
✅ **Puedes empezar a hacer pruebas inmediatamente**  
✅ **Las APIs están optimizadas y listas para uso real**  
✅ **El frontend está desplegado y conectado**  

**¡Disfruta explorando CityLights! 🌟**