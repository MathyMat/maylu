-- Ejecutar en SQL Editor de Supabase
-- Agrega la funcion decrement_likes que falta

CREATE OR REPLACE FUNCTION decrement_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = comment_id;
END;
$$;
