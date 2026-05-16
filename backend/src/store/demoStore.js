const bcrypt = require('bcryptjs');

const PASSWORD_HASH = '$2b$10$rd54l/BhJgrZkNEARClI/uEupEIQ9M9o7YkJVbQbu/pVA81jeYd/G';

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
      assigned_to: null,
      created_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
      updated_at: new Date('2026-05-10T00:00:00.000Z').toISOString(),
    },
  ],
  comments: [
    {
      id: 1,
      request_id: 1,
      user_id: 1,
      text: 'We are reviewing this issue now.',
      created_at: new Date('2026-05-10T01:00:00.000Z').toISOString(),
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
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  state.requests.unshift(request);
  return request;
};

const getRequestsByUserId = async (userId) => state.requests.filter((request) => Number(request.user_id) === Number(userId));

const getRequestById = async (requestId) => {
  const request = state.requests.find((item) => Number(item.id) === Number(requestId));
  if (!request) return null;
  const user = findUserById(request.user_id);
  return {
    ...request,
    full_name: user ? user.full_name : '',
    email: user ? user.email : '',
  };
};

const getAllRequests = async ({ search = '', status = '', category = '', priority = '' }) => {
  const searchTerm = search.trim().toLowerCase();
  return state.requests
    .map((request) => {
      const user = findUserById(request.user_id);
      return {
        ...request,
        full_name: user ? user.full_name : '',
        email: user ? user.email : '',
      };
    })
    .filter((request) => {
      const matchesSearch =
        !searchTerm ||
        request.title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        String(request.full_name).toLowerCase().includes(searchTerm);
      const matchesStatus = !status || request.status === status;
      const matchesCategory = !category || request.category === category;
      const matchesPriority = !priority || request.priority === priority;
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
};

const updateRequestStatus = async ({ requestId, status, assignedTo }) => {
  const request = state.requests.find((item) => Number(item.id) === Number(requestId));
  if (!request) return null;
  request.status = status;
  if (typeof assignedTo !== 'undefined') {
    request.assigned_to = assignedTo;
  }
  request.updated_at = new Date().toISOString();
  return request;
};

const deleteRequestById = async (requestId) => {
  const before = state.requests.length;
  state.requests = state.requests.filter((item) => Number(item.id) !== Number(requestId));
  state.comments = state.comments.filter((item) => Number(item.request_id) !== Number(requestId));
  return state.requests.length !== before;
};

const addComment = async ({ requestId, userId, text }) => {
  const comment = {
    id: nextId(state.comments),
    request_id: Number(requestId),
    user_id: Number(userId),
    text,
    created_at: new Date().toISOString(),
  };
  state.comments.push(comment);
  return comment;
};

const getCommentsByRequestId = async (requestId) =>
  state.comments
    .filter((comment) => Number(comment.request_id) === Number(requestId))
    .map((comment) => {
      const user = findUserById(comment.user_id);
      return {
        ...comment,
        full_name: user ? user.full_name : '',
        email: user ? user.email : '',
      };
    });

const getAnalytics = async () => {
  const total = state.requests.length;
  const pending = state.requests.filter((r) => r.status === 'Pending').length;
  const inProgress = state.requests.filter((r) => r.status === 'In Progress').length;
  const completed = state.requests.filter((r) => r.status === 'Completed').length;

  const byCategory = {};
  const byPriority = {};

  state.requests.forEach((request) => {
    byCategory[request.category] = (byCategory[request.category] || 0) + 1;
    byPriority[request.priority] = (byPriority[request.priority] || 0) + 1;
  });

  return { total, pending, inProgress, completed, byCategory, byPriority };
};

const verifyPassword = async (password, passwordHash) => {
  if (!passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  createRequest,
  getRequestsByUserId,
  getRequestById,
  getAllRequests,
  updateRequestStatus,
  deleteRequestById,
  addComment,
  getCommentsByRequestId,
  getAnalytics,
  verifyPassword,
};
