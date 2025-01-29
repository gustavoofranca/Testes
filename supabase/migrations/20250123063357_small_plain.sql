/*
  # Create user roles table

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key) - matches auth.users id
      - `role` (text) - either 'admin' or 'customer'
      - `email` (text) - user's email
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for reading own role
    - Add policy for admins to read all roles
*/

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('admin', 'customer')),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ler seu próprio role
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins podem ler todos os roles
CREATE POLICY "Admins can read all roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );