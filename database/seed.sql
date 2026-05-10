-- Sample users
-- Password for all below accounts: Password@123
-- You should generate real hashes in production.

INSERT INTO users (full_name, email, password_hash, role, department, phone)
VALUES
  (
    'System Admin',
    'admin@company.com',
    '$2b$10$QK3Fnyo8R0Yx1mQZ3qvLMeaqA8Qx9JR6mYxWRU2uCA6Q22mHZVD2.',
    'admin',
    'Operations',
    '+1 555 100 2000'
  ),
  (
    'John Employee',
    'john@company.com',
    '$2b$10$QK3Fnyo8R0Yx1mQZ3qvLMeaqA8Qx9JR6mYxWRU2uCA6Q22mHZVD2.',
    'user',
    'Finance',
    '+1 555 111 2222'
  ),
  (
    'Maya Analyst',
    'maya@company.com',
    '$2b$10$QK3Fnyo8R0Yx1mQZ3qvLMeaqA8Qx9JR6mYxWRU2uCA6Q22mHZVD2.',
    'user',
    'Business Analysis',
    '+1 555 333 4444'
  )
ON CONFLICT (email) DO NOTHING;

-- Sample requests
INSERT INTO service_requests (user_id, title, description, category, priority, status)
VALUES
  (2, 'Laptop not turning on', 'Device shows no power indicator after charging.', 'IT Support', 'High', 'Pending'),
  (2, 'Need VPN access', 'Please enable VPN access for remote work setup.', 'IT Support', 'Medium', 'In Progress'),
  (3, 'Air conditioner maintenance', 'Meeting room AC is not cooling properly.', 'Facilities', 'Low', 'Completed');