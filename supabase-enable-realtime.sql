-- Ejecutar en SQL Editor de Supabase
-- Habilita Realtime en la tabla comments para los comentarios en vivo

alter publication supabase_realtime add table comments;
