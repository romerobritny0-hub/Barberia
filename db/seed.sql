-- =============================================
-- TAUROS BARBERÍA - Datos de Ejemplo
-- Ejecute después del schema.sql
-- =============================================

-- El usuario admin ya se inserta en schema.sql
-- Aquí solo insertamos barberos, sillas y citas de ejemplo

-- Insertar barberos (si no existen)
INSERT INTO barberos (nombre, especialidad, imagen) 
SELECT 'Carlos Mendoza', 'Corte Clásico', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM barberos WHERE nombre = 'Carlos Mendoza');

INSERT INTO barberos (nombre, especialidad, imagen) 
SELECT 'Luis García', 'Fade Moderno', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM barberos WHERE nombre = 'Luis García');

INSERT INTO barberos (nombre, especialidad, imagen) 
SELECT 'Miguel Torres', 'Diseño y Barba', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM barberos WHERE nombre = 'Miguel Torres');

-- Insertar sillas (si no existen)
INSERT INTO sillas (numero, ubicacion, estado) 
SELECT 1, 'Sala Principal', 'disponible'
WHERE NOT EXISTS (SELECT 1 FROM sillas WHERE numero = 1);

INSERT INTO sillas (numero, ubicacion, estado) 
SELECT 2, 'Sala Principal', 'disponible'
WHERE NOT EXISTS (SELECT 1 FROM sillas WHERE numero = 2);

INSERT INTO sillas (numero, ubicacion, estado) 
SELECT 3, 'Sala Principal', 'disponible'
WHERE NOT EXISTS (SELECT 1 FROM sillas WHERE numero = 3);

INSERT INTO sillas (numero, ubicacion, estado) 
SELECT 4, 'Área VIP', 'disponible'
WHERE NOT EXISTS (SELECT 1 FROM sillas WHERE numero = 4);

-- Insertar citas de ejemplo (si no existen para evitar duplicados)
INSERT INTO citas (cliente_nombre, cliente_telefono, barbero_id, silla_id, fecha, hora, estado, servicio) 
SELECT 'Juan Pérez', '555-1234', 1, 1, CURRENT_DATE, '10:00 AM', 'confirmada', 'Corte Clásico'
WHERE NOT EXISTS (
    SELECT 1 FROM citas 
    WHERE barbero_id = 1 AND fecha = CURRENT_DATE AND hora = '10:00 AM'
);

INSERT INTO citas (cliente_nombre, cliente_telefono, barbero_id, silla_id, fecha, hora, estado, servicio) 
SELECT 'María López', '555-5678', 2, 2, CURRENT_DATE, '11:00 AM', 'pendiente', 'Fade Moderno'
WHERE NOT EXISTS (
    SELECT 1 FROM citas 
    WHERE barbero_id = 2 AND fecha = CURRENT_DATE AND hora = '11:00 AM'
);

INSERT INTO citas (cliente_nombre, cliente_telefono, barbero_id, silla_id, fecha, hora, estado, servicio) 
SELECT 'Carlos Ruiz', '555-9012', 3, 3, CURRENT_DATE, '2:00 PM', 'confirmada', 'Diseño y Barba'
WHERE NOT EXISTS (
    SELECT 1 FROM citas 
    WHERE barbero_id = 3 AND fecha = CURRENT_DATE AND hora = '2:00 PM'
);
