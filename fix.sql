CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, identifier, first_name, last_name, dob, gender, mobile)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    (new.raw_user_meta_data->>'dob')::DATE,
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'mobile'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
