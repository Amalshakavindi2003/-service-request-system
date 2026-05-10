const pool = require('../config/db');
const { isDemoMode } = require('../config/runtime');
const demoStore = require('../store/demoStore');

const createServiceRequest = async ({ userId, title, description, category, priority }) => {
  if (isDemoMode()) return demoStore.createRequest({ userId, title, description, category, priority });
  const query = `
    INSERT INTO service_requests (user_id, title, description, category, priority)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, title, description, category, priority, status, created_at, updated_at
  `;
  const values = [userId, title, description, category, priority];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getRequestsByUserId = async (userId) => {
  if (isDemoMode()) return demoStore.getRequestsByUserId(userId);
  const query = `
    SELECT id, user_id, title, description, category, priority, status, created_at, updated_at
    FROM service_requests
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const getAllRequests = async ({ search = '', status = '' }) => {
  if (isDemoMode()) return demoStore.getAllRequests({ search, status });
  const values = [];
  let whereClause = 'WHERE 1=1';

  if (search) {
    values.push(`%${search}%`);
    whereClause += ` AND (sr.title ILIKE $${values.length} OR sr.description ILIKE $${values.length} OR u.full_name ILIKE $${values.length})`;
  }

  if (status) {
    values.push(status);
    whereClause += ` AND sr.status = $${values.length}`;
  }

  const query = `
    SELECT
      sr.id,
      sr.user_id,
      sr.title,
      sr.description,
      sr.category,
      sr.priority,
      sr.status,
      sr.created_at,
      sr.updated_at,
      u.full_name,
      u.email
    FROM service_requests sr
    JOIN users u ON sr.user_id = u.id
    ${whereClause}
    ORDER BY sr.created_at DESC
  `;

  const { rows } = await pool.query(query, values);
  return rows;
};

const updateRequestStatus = async ({ requestId, status }) => {
  if (isDemoMode()) return demoStore.updateRequestStatus({ requestId, status });
  const query = `
    UPDATE service_requests
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, user_id, title, description, category, priority, status, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [status, requestId]);
  return rows[0];
};

const deleteRequestById = async (requestId) => {
  if (isDemoMode()) return demoStore.deleteRequestById(requestId);
  const { rowCount } = await pool.query('DELETE FROM service_requests WHERE id = $1', [requestId]);
  return rowCount > 0;
};

module.exports = {
  createServiceRequest,
  getRequestsByUserId,
  getAllRequests,
  updateRequestStatus,
  deleteRequestById,
};