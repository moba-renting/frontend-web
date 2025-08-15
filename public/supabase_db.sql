-- =================================================================
-- SECCIÓN 1: PERFILES DE USUARIO
-- =================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT
);


-- =================================================================
-- SECCIÓN 2: SISTEMA DE ROLES
-- =================================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);


-- =================================================================
-- SECCIÓN 3: AUTOMATIZACIÓN EN LA CREACIÓN DE USUARIOS
-- =================================================================

INSERT INTO roles (name, description) VALUES
('admin', 'Administrador con acceso total a la plataforma.'),
('customer', 'Cliente, rol por defecto para nuevos usuarios.');

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_default_role_id UUID;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  SELECT id INTO v_default_role_id FROM public.roles WHERE name = 'customer';

  IF v_default_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (new.id, v_default_role_id);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();