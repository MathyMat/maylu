-- Tabla para el contador de clicks en la foto de Maylu
CREATE TABLE IF NOT EXISTS photo_clicks (
  id integer PRIMARY KEY DEFAULT 1,
  count integer NOT NULL DEFAULT 0
);

-- Fila inicial
INSERT INTO photo_clicks (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Permitir lectura pública (RLS)
ALTER TABLE photo_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_photo_clicks" ON photo_clicks;
CREATE POLICY "select_photo_clicks" ON photo_clicks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "update_photo_clicks" ON photo_clicks;
CREATE POLICY "update_photo_clicks" ON photo_clicks
  FOR UPDATE USING (true);

-- Función para incrementar el contador (con SECURITY DEFINER para bypass RLS)
CREATE OR REPLACE FUNCTION increment_photo_click()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE photo_clicks SET count = count + 1 WHERE id = 1;
$$;
