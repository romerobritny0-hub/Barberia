-- =============================================
-- TAUROS BARBERÍA - Datos de Ejemplo
-- Ejecute después del schema.sql
-- =============================================

-- Insertar barberos
INSERT INTO barberos (nombre, especialidad, imagen) VALUES
('Carlos Mendoza', 'Corte Clásico', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&crop=face'),
('Luis García', 'Fade Moderno', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'),
('Miguel Torres', 'Diseño y Barba', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face');

-- Insertar sillas
INSERT INTO sillas (numero, ubicacion, estado) VALUES
(1, 'Sala Principal', 'disponible'),
(2, 'Sala Principal', 'disponible'),
(3, 'Sala Principal', 'disponible'),
(4, 'Área VIP', 'disponible');

-- Insertar citas de ejemplo
INSERT INTO citas (cliente_nombre, cliente_telefono, barbero_id, silla_id, fecha, hora, estado, servicio) VALUES
('Juan Pérez', '555-1234', 1, 1, CURRENT_DATE, '10:00 AM', 'confirmada', 'Corte Clásico'),
('María López', '555-5678', 2, 2, CURRENT_DATE, '11:00 AM', 'pendiente', 'Fade Moderno'),
('Carlos Ruiz', '555-9012', 3, 3, CURRENT_DATE, '2:00 PM', 'confirmada', 'Diseño y Barba'),
('Ana Martínez', '555-3456', 1, 1, CURRENT_DATE + INTERVAL '1 day', '10:00 AM', 'pendiente', 'Corte Clásico'),
('Roberto Sánchez', '555-7890', 2, 2, CURRENT_DATE + INTERVAL '1 day', '3:00 PM', 'confirmada', 'Fade Moderno');
