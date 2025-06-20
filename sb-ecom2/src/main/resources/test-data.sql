-- Test data for debugging product creation issues

-- Insert test categories if they don't exist
INSERT INTO categories (category_id, category_name) VALUES (1, 'Electronics') ON CONFLICT DO NOTHING;
INSERT INTO categories (category_id, category_name) VALUES (2, 'Clothing') ON CONFLICT DO NOTHING;
INSERT INTO categories (category_id, category_name) VALUES (3, 'Books') ON CONFLICT DO NOTHING;

-- Check if tables exist and have correct structure
-- You can run these queries manually to verify your database setup

-- Check categories table
-- SELECT * FROM categories;

-- Check users table
-- SELECT user_id, username, email FROM users;

-- Check roles table
-- SELECT * FROM roles;

-- Check user_role mapping
-- SELECT u.username, r.role_name FROM users u 
-- JOIN user_role ur ON u.user_id = ur.user_id 
-- JOIN roles r ON ur.role_id = r.role_id;

-- Check products table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'products';
