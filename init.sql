DROP TABLE usuarios;
-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Tabla registros
CREATE TABLE IF NOT EXISTS registros (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    escuela INT NOT NULL,
    mesa INT NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FO
