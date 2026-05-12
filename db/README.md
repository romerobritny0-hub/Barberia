# Base de Datos - Tauros Barbería

## Archivos

- **schema.sql**: Estructura de la base de datos (tablas, relaciones, triggers, políticas)
- **seed.sql**: Datos de ejemplo para pruebas

## Tablas

### administradores
Almacena los usuarios administradores del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| nombre | VARCHAR(100) | Nombre completo |
| username | VARCHAR(50) | Nombre de usuario (único) |
| password | VARCHAR(255) | Contraseña |
| rol | VARCHAR(20) | admin/superadmin |
| activo | BOOLEAN | Si está activo (default: true) |
| ultimo_acceso | TIMESTAMP | Último inicio de sesión |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Usuario default:**
- Username: `admin`
- Password: `admin2015`
- Rol: `superadmin`

### barberos
Almacena la información de los barberos disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| nombre | VARCHAR(100) | Nombre completo |
| especialidad | VARCHAR(100) | Especialidad del barbero |
| imagen | TEXT | URL de la foto |
| telefono | VARCHAR(20) | Teléfono de contacto |
| email | VARCHAR(100) | Correo electrónico |
| activo | BOOLEAN | Si está activo (default: true) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

### sillas
Estaciones de trabajo disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| numero | INTEGER | Número de silla (único) |
| ubicacion | VARCHAR(100) | Ubicación en el local |
| estado | VARCHAR(20) | disponible/ocupada/mantenimiento |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

### citas
Citas programadas por los clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| cliente_nombre | VARCHAR(100) | Nombre del cliente |
| cliente_telefono | VARCHAR(20) | Teléfono del cliente |
| cliente_email | VARCHAR(100) | Email del cliente |
| barbero_id | INTEGER | FK → barberos |
| silla_id | INTEGER | FK → sillas |
| fecha | DATE | Fecha de la cita |
| hora | VARCHAR(20) | Hora de la cita |
| estado | VARCHAR(20) | pendiente/confirmada/completada/cancelada |
| servicio | VARCHAR(100) | Servicio solicitado |
| observaciones | TEXT | Notas adicionales |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Restricción Única**: `UNIQUE(barbero_id, fecha, hora)` - Evita doble reservas

### reservas_horarios
Horarios bloqueados por barbero.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| barbero_id | INTEGER | FK → barberos |
| fecha | DATE | Fecha bloqueada |
| hora | VARCHAR(20) | Hora bloqueada |
| disponible | BOOLEAN | false = ocupado |
| created_at | TIMESTAMP | Fecha de creación |

**Restricción Única**: `UNIQUE(barbero_id, fecha, hora)`

### log_actividad
Registra actividad de los administradores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (Primary Key) |
| administrador_id | INTEGER | FK → administradores |
| accion | VARCHAR(100) | Acción realizada |
| detalle | TEXT | Detalles de la acción |
| ip_address | VARCHAR(45) | Dirección IP |
| created_at | TIMESTAMP | Fecha y hora |

## Roles de Administrador

### admin
- Puede gestionar barberos, sillas y citas
- Puede ver reportes
- **No puede** gestionar otros administradores

### superadmin
- Todos los permisos de admin
- **Puede** gestionar otros administradores
- Puede agregar, editar y eliminar usuarios

## Estados

### Estado de Cita
- `pendiente`: Esperando confirmación
- `confirmada`: Aceptada, en espera
- `completada`: Servicio realizado
- `cancelada`: Cita cancelada

### Estado de Silla
- `disponible`: Libre para usar
- `ocupada`: En uso actualmente
- `mantenimiento`: No disponible

## Instalación en Supabase

1. Ir al panel de SQL Editor de Supabase
2. Ejecutar `schema.sql` primero
3. Ejecutar `seed.sql` para datos de prueba

## Credenciales por Defecto

| Username | Password | Rol |
|----------|----------|-----|
| admin | admin2015 | superadmin |

## Funcionalidades Automáticas

- **updated_at automático**: El campo se actualiza al modificar cualquier registro
- **Evitar doble reserva**: Constraint UNIQUE en (barbero, fecha, hora)
- **Integridad referencial**: ON DELETE SET NULL para FK en citas
- **Desactivación suave**: Los admins no se eliminan, solo se desactivan
