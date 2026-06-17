-- Ejecutar en SQL Editor de Supabase
-- Valida que cada usuario solo pueda enviar 5 comentarios por día

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
