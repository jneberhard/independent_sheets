INSERT INTO "Role" ("id", "name") VALUES
  ('role_customer', 'CUSTOMER'),
  ('role_artist', 'ARTIST'),
  ('role_admin', 'ADMIN')
ON CONFLICT ("name") DO NOTHING;