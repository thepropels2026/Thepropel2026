import psycopg2

regions = [
    "us-east-1", "us-west-1", "us-west-2", "eu-central-1", "eu-west-1", 
    "eu-west-2", "eu-west-3", "eu-north-1", "ap-south-1", "ap-northeast-1", 
    "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "sa-east-1", "ca-central-1"
]

sql_script = """
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
"""

poolers = [
    "aws-0-pooler.supabase.com",
    "aws-0-global.pooler.supabase.com",
    "pooler.supabase.com"
]

success = False
for pooler in poolers:
    db_url = f"postgresql://postgres.mjwadwxwnwkbcfndvnfy:%40Sushant02082005!@{pooler}:6543/postgres"
    try:
        print(f"Trying {pooler}...")
        conn = psycopg2.connect(db_url, connect_timeout=5)
        conn.autocommit = True
        cursor = conn.cursor()
        print(f"Connected to {pooler}! Executing SQL fix...")
        cursor.execute(sql_script)
        print("SUCCESS: Trigger updated successfully!")
        cursor.close()
        conn.close()
        success = True
        break
    except Exception as e:
        print(f"Failed {pooler}: {e}")

if not success:
    print("FAILED: Could not connect to any region.")
