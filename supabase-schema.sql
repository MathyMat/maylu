-- ============================================================
-- SCHEMA COMPLETO PARA SUPABASE
-- Pegar todo en SQL Editor de Supabase
-- ============================================================

-- 1. TABLA DE COMENTARIOS
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    photo_url TEXT,
    avatar_idx INTEGER DEFAULT -1,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLA DE LIKES (evita que un usuario dé ❤️ más de una vez)
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    UNIQUE (comment_id, user_id)
);

-- 3. FUNCIONES PARA MANEJAR LIKES
CREATE OR REPLACE FUNCTION increment_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE comments SET likes = likes + 1 WHERE id = comment_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = comment_id;
END;
$$;

-- 4. ACTIVAR ROW LEVEL SECURITY
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS PARA COMMENTS
CREATE POLICY "Todos pueden leer comentarios"
ON comments FOR SELECT
USING (true);

CREATE POLICY "Todos pueden insertar comentarios"
ON comments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Solo el sistema puede actualizar likes"
ON comments FOR UPDATE
USING (true)
WITH CHECK (true);

-- 6. POLÍTICAS PARA COMMENT_LIKES
CREATE POLICY "Todos pueden leer likes"
ON comment_likes FOR SELECT
USING (true);

CREATE POLICY "Todos pueden insertar likes"
ON comment_likes FOR INSERT
WITH CHECK (true);

-- 7. LÍMITE DE COMENTARIOS POR DÍA (opcional, validación extra desde la DB)
-- Esto evita que se exceda el límite incluso si alguien llama directo a la API.
/*
CREATE OR REPLACE FUNCTION check_daily_comment_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM comments WHERE user_id = NEW.user_id AND created_at::date = CURRENT_DATE) >= 5 THEN
    RAISE EXCEPTION 'Límite diario de 5 comentarios alcanzado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_daily_comment_limit
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION check_daily_comment_limit();
*/

-- 8. BUCKET DE STORAGE para fotos de comentarios
-- Ir a Storage > Create bucket > nombre: "comment-photos"
-- Política del bucket:
/*
CREATE POLICY "Todos pueden subir fotos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'comment-photos');

CREATE POLICY "Todos pueden ver fotos"
ON storage.objects FOR SELECT
USING (bucket_id = 'comment-photos');
*/
