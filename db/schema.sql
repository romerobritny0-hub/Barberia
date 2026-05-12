-- =============================================
-- TAUROS BARBERÍA - Schema de Base de Datos
-- Supabase PostgreSQL
-- =============================================

-- Tabla: administradores
-- Almacena los usuarios administradores del sistema
CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'admin' CHECK (rol IN ('admin', 'superadmin')),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: barberos
-- Almacena la información de los barberos
CREATE TABLE barberos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    imagen TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: sillas
-- Almacena las estaciones de trabajo
CREATE TABLE sillas (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    ubicacion VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: citas
-- Almacena las citas programadas
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    cliente_email VARCHAR(100),
    barbero_id INTEGER REFERENCES barberos(id) ON DELETE SET NULL,
    silla_id INTEGER REFERENCES sillas(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    servicio VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(barbero_id, fecha, hora)
);

-- Tabla: reservas_horarios
-- Almacena los horarios bloqueados por barbero
CREATE TABLE reservas_horarios (
    id SERIAL PRIMARY KEY,
    barbero_id INTEGER REFERENCES barberos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    disponible BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(barbero_id, fecha, hora)
);

-- Tabla: log_actividad
-- Registra actividad de los administradores
CREATE TABLE log_actividad (
    id SERIAL PRIMARY KEY,
    administrador_id INTEGER REFERENCES administradores(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- DATOS DE EJEMPLO (Seed Data)
-- =============================================

-- Insertar administrador (username: admin, password: admin2015)
INSERT INTO administradores (nombre, username, password, rol) VALUES
('Administrador', 'admin', 'admin2015', 'superadmin');

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

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_administradores_updated_at
    BEFORE UPDATE ON administradores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_barberos_updated_at
    BEFORE UPDATE ON barberos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sillas_updated_at
    BEFORE UPDATE ON sillas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citas_updated_at
    BEFORE UPDATE ON citas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE barberos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_actividad ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para lectura
CREATE POLICY "Allow public read" ON administradores FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON barberos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON sillas FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON citas FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON reservas_horarios FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON log_actividad FOR SELECT USING (true);

-- Políticas para modificaciones
CREATE POLICY "Allow public insert" ON administradores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON administradores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON administradores FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON barberos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON barberos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON barberos FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON sillas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON sillas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON sillas FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON citas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON citas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON citas FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON reservas_horarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON reservas_horarios FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON reservas_horarios FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON log_actividad FOR INSERT WITH CHECK (true);
