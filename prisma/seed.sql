INSERT INTO "Role" ("id", "name") VALUES
  ('role_user', 'USER'),
  ('role_publisher', 'PUBLISHER'),
  ('role_admin', 'ADMIN')
ON CONFLICT ("name") DO NOTHING;