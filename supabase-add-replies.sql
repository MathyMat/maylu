-- Ejecutar en SQL Editor de Supabase
-- Agrega columna parent_id para comentarios anidados (respuestas)

ALTER TABLE comments ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
