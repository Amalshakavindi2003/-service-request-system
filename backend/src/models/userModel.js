const pool = require('../config/db');
const { isDemoMode } = require('../config/runtime');
const demoStore = require('../store/demoStore');

const createUser = async ({ fullName, email, passwordHash, role = 'user' }) => {
  if (isDemoMode()) {
    return demoStore.createUser({ fullName, email, passwordHash, role });
  }

  const query = `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, role, created_at, updated_at
  `;
  const values = [fullName, email, passwordHash, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  if (isDemoMode()) return demoStore.findUserByEmail(email);
  const { rows } = await pool.query(
    'SELECT id, full_name, email, password_hash, role, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return rows[0];
};

const findUserById = async (id) => {
  if (isDemoMode()) return demoStore.findUserById(id);
  const { rows } = await pool.query(
    'SELECT id, full_name, email, role, department, phone, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

const updateUserProfile = async ({ id, fullName, department, phone }) => {
  if (isDemoMode()) return demoStore.updateUserProfile({ id, fullName, department, phone });
  const query = `
    UPDATE users
    SET full_name = $1,
        department = $2,
        phone = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING id, full_name, email, role, department, phone, created_at, updated_at
  `;
  const values = [fullName, department, phone, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
};