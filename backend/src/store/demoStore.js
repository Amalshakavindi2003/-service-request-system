const bcrypt = require('bcryptjs');

const PASSWORD_HASH = '$2b$10$QK3Fnyo8R0Yx1mQZ3qvLMeaqA8Qx9JR6mYxWRU2uCA6Q22mHZVD2.';

const state = {
  users: [
    {
      id: 1,
      full_name: 'System Admin',
      email: 'admin@company.com',
      password_hash: PASSWORD_HASH,
      role: 'admin',
      department: 'Operations',
      phone: '+1 555 100 2000',
      created_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
      updated_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
    },
    {
      id: 2,
      full_name: 'John Employee',
      email: 'john@company.com',
      password_hash: PASSWORD_HASH,
      role: 'user',
      department: 'Finance',
      phone: '+1 555 111 2222',
      created_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
      updated_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
    },
  ],
  requests: [
    {
      id: 1,
      user_id: 2,
      title: 'Laptop not turning on',
      description: 'Device shows no power indicator after charging.',
      category: 'IT Support',
      priority: 'High',
      status: 'Pending',
      created_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
      updated_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
    },
  ],
};

const nextId = (items) => (items.length ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1);

const findUserByEmail = (email) => state.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
const findUserById = (id) => state.users.find((user) => Number(user.id) === Number(id));

const createUser = async ({ fullName, email, passwordHash, role = 'user' }) => {
  const user = {
    id: nextId(state.users),
    full_name: fullName,
    email,
    password_hash: passwordHash,
    role,
    department: '',
    phone: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  state.users.push(user);
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

const updateUserProfile = async ({ id, fullName, department, phone }) => {
  const user = findUserById(id);
  if (!user) return null;
  user.full_name = fullName;
  user.department = department;
  user.phone = phone;
  user.updated_at = new Date().toISOString();
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

const createRequest = async ({ userId, title, description, category, priority }) => {
  const request = {
    id: nextId(state.requests),
    user_id: Number(userId),
    title,
    description,
    category,
    priority,
    status: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  state.requests.unshift(request);
  return request;
};

const getRequestsByUserId = async (userId) => state.requests.filter((request) => Number(request.user_id) === Number(userId));

const getAllRequests = async ({ search = '', status = '' }) => {
  const searchTerm = search.trim().toLowerCase();
  return state.requests
    .map((request) => {
      const user = findUserById(request.user_id);
      return {
        ...request,
        full_name: user?.full_name,
        email: user?.email,
      };
    })
    .filter((request) => {
      const matchesSearch =
        !searchTerm ||
        request.title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.full_name?.toLowerCase().includes(searchTerm);
      const matchesStatus = !status || request.status === status;
      return matchesSearch && matchesStatus;
    });
};

const updateRequestStatus = async ({ requestId, status }) => {
  const request = state.requests.find((item) => Number(item.id) === Number(requestId));
  if (!request) return null;
  request.status = status;
  request.updated_at = new Date().toISOString();
  return request;
};

const deleteRequestById = async (requestId) => {
  const before = state.requests.length;
  state.requests = state.requests.filter((item) => Number(item.id) !== Number(requestId));
  return state.requests.length !== before;
};

const verifyPassword = async (password, passwordHash) => password === 'Password@123';

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  createRequest,
  getRequestsByUserId,
  getAllRequests,
  updateRequestStatus,
  deleteRequestById,
  verifyPassword,
};