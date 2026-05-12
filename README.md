# Tauros Barbería - Sistema de Gestión de Turnos

Aplicación móvil y web desarrollada con React Native + Expo para la gestión de citas en barbería.

## Características

### Cliente
- **Visualización de barberos**: Cards responsivas con foto, nombre y especialidad
- **Agendamiento de citas**: Selección de fecha (a partir de hoy) y horario (8AM - 8PM)
- **Bloqueo automático**: Horarios ocupados y horas pasadas se bloquean automáticamente
- **Diseño responsive**: 1 columna en móviles, 2 en tablets, 3 en desktop
- **Modales estilizados**: Confirmación, éxito y advertencias con diseño premium

### Administrador
- **Login con usuario y contraseña**: Autenticación mediante base de datos
- **Panel administrativo**: Menú con módulos según rol
- **Gestión de barberos**: CRUD completo conectado a Supabase
- **Gestión de sillas**: CRUD con estados (disponible, ocupada, mantenimiento)
- **Gestión de citas**: CRUD con estados (pendiente, confirmada, completada, cancelada)
- **Gestión de usuarios**: CRUD de administradores (solo superadmin)
- **Reportes**: Estadísticas y gráficos de rendimiento

## Estructura del Proyecto

```
BarberiaApp/
├── App.jsx                          # Punto de entrada con providers
├── src/
│   ├── screens/                     # Pantallas principales
│   │   ├── HomeScreen.jsx           # Lista de barberos
│   │   ├── BarberDetailScreen.jsx   # Detalle y agendamiento
│   │   ├── AdminLoginScreen.jsx     # Login administrativo
│   │   └── admin/                   # Módulo administrativo
│   │       ├── AdminPanel.jsx        # Panel principal
│   │       ├── AdminBarbers.jsx      # CRUD barberos
│   │       ├── AdminSillas.jsx       # CRUD sillas
│   │       ├── AdminCitas.jsx        # CRUD citas
│   │       ├── AdminReportes.jsx     # Reportes
│   │       └── AdminUsers.jsx        # CRUD administradores
│   ├── navigation/
│   │   └── AppNavigator.jsx          # Stack Navigator
│   ├── services/                     # Servicios de datos
│   │   ├── supabase.js              # Cliente Supabase
│   │   ├── barberService.js         # CRUD barberos
│   │   ├── sillaService.js          # CRUD sillas
│   │   ├── citaService.js           # CRUD citas
│   │   └── adminService.js          # CRUD administradores
│   ├── context/
│   │   └── BookingContext.jsx       # Estado global de reservas
│   ├── constants/
│   │   └── barbers.js               # Datos y horarios
│   └── theme/
│       └── colors.js                # Paleta de colores
├── db/                               # Documentación de BD
│   ├── schema.sql                   # Estructura de tablas
│   ├── seed.sql                     # Datos de ejemplo
│   └── README.md                    # Documentación de BD
```

## Tecnologías

- **React Native** 0.81.5
- **Expo** 54.0.33
- **React Navigation** 7.x
- **Supabase** (backend as a service)
- **React Native Web**

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar en web
npm run web

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## Configuración

### Supabase

El proyecto está configurado con Supabase. Para cambiar la conexión, edita `src/services/supabase.js`:

```javascript
const supabaseUrl = 'https://hoewrjqezcriudfylwdm.supabase.co';
const supabaseAnonKey = 'sb_publishable_KegFhb2mPI3vWGQ2AeQ25Q_52QsGrUP';
```

### Base de Datos (Supabase)

Ver `db/schema.sql` para la estructura completa. Tablas principales:

**administradores**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR | Nombre completo |
| username | VARCHAR | Usuario (único) |
| password | VARCHAR | Contraseña |
| rol | VARCHAR | admin/superadmin |

**barberos**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR | Nombre del barbero |
| especialidad | VARCHAR | Especialidad |
| imagen | TEXT | URL de imagen |

**sillas**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| numero | INTEGER | Número de silla |
| ubicacion | VARCHAR | Ubicación |
| estado | VARCHAR | disponible/ocupada/mantenimiento |

**citas**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| cliente_nombre | VARCHAR | Nombre del cliente |
| barbero_id | INTEGER | FK → barberos |
| fecha | DATE | Fecha de la cita |
| hora | VARCHAR | Hora de la cita |
| estado | VARCHAR | pendiente/confirmada/completada/cancelada |

## Instalación de Base de Datos

1. Ir al SQL Editor de Supabase
2. Ejecutar `db/schema.sql`
3. Ejecutar `db/seed.sql` para datos de prueba

## Credenciales

### Administrador Default
| Username | Password | Rol |
|----------|----------|-----|
| admin | admin2015 | superadmin |

## Roles de Administrador

| Rol | Permisos |
|-----|----------|
| admin | Gestiona barberos, sillas, citas y reportes |
| superadmin | Todos los permisos + gestionar administradores |

## Horarios

- Horario de atención: 8:00 AM - 8:00 PM
- Intervalo: 1 hora
- Total de horarios: 13 opciones

## Estados de Cita

| Estado | Descripción | Color |
|--------|-------------|-------|
| Pendiente | Esperando confirmación | 🟠 Naranja |
| Confirmada | Aceptada, pendiente | 🟢 Verde |
| Completada | Servicio realizado | 🔵 Azul |
| Cancelada | Cita cancelada | 🔴 Rojo |

## Estados de Silla

| Estado | Descripción | Color |
|--------|-------------|-------|
| Disponible | Silla libre | 🟢 Verde |
| Ocupada | En uso | 🟠 Naranja |
| Mantenimiento | No disponible | 🔴 Rojo |

## Diseño

### Paleta de Colores
- **Primario (Dorado)**: #D4AF37
- **Fondo**: #0F0E17
- **Cards**: #1C1B29
- **Texto Principal**: #FFF
- **Texto Secundario**: #888
- **Error**: #ff4444
- **Éxito**: #4CAF50
- **Advertencia**: #FF9800
- **Info**: #2196F3
- **Superadmin**: #9C27B0

### Responsive
- Móvil pequeño (<400px): 1 columna
- Tablet (400-768px): 2 columnas
- Desktop (>768px): 3 columnas

## Funcionalidades Implementadas

- [x] Visualización de barberos con cards
- [x] Agendamiento de citas
- [x] Bloqueo de horarios ocupados
- [x] Bloqueo de horas pasadas
- [x] Validación de fechas
- [x] Modales de confirmación
- [x] Panel administrativo con roles
- [x] CRUD barberos con Supabase
- [x] CRUD sillas con Supabase
- [x] CRUD citas con Supabase
- [x] CRUD administradores (superadmin)
- [x] Reportes y estadísticas
- [x] Conexión a Supabase
- [x] Diseño responsive
- [x] Dark mode premium
- [x] Documentación de base de datos
