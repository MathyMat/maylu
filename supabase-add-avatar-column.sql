-- Ejecutar en SQL Editor de Supabase
-- Agrega columna avatar_idx a la tabla comments

ALTER TABLE comments ADD COLUMN avatar_idx INTEGER DEFAULT -1;
