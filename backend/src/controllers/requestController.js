const {
  createRequest,
  getRequestsByUserId,
  getRequestById,
  updateRequestStatus,
  deleteRequestById,
  getAllRequests,
  addComment,
  getCommentsByRequestId,
  getAnalytics,
} = require('../models/requestModel');
const { isDemoMode } = require('../config/runtime');

const ALLOWED_STATUSES = new Set(['Pending', 'In Progress', 'Completed']);

const createServiceRequest = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const request = await createRequest({ userId, title, description, category, priority });
    return res.status(201).json({ message: 'Request created successfully', request, mode: isDemoMode() ? 'demo' : 'live' });
  } catch (error) { return next(error); }
};

const getUserRequests = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const requests = await getRequestsByUserId(userId);
    return res.status(200).json({ requests });
  } catch (error) { return next(error); }
};

const getServiceRequestById = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user?.id;
    const role = req.user?.role;
    if (!currentUserId) return res.status(401).json({ message: 'Unauthorized' });

    const request = await getRequestById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isPrivileged = role === 'admin' || role === 'staff';
    const isOwner = Number(request.user_id) === Number(currentUserId);

    if (!isPrivileged && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(200).json({ request });
  } catch (error) { return next(error); }
};

const getAllServiceRequests = async (req, res, next) => {
  try {
    const { search = '', status = '', category = '', priority = '' } = req.query;
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const requests = await getAllRequests({ search, status, category, priority });
    return res.status(200).json({ requests });
  } catch (error) { return next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status, assignedTo } = req.body;
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'staff') return res.status(403).json({ message: 'Forbidden' });

    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const normalizedAssignee = typeof assignedTo === 'string' ? assignedTo.trim() : assignedTo;
    const request = await updateRequestStatus({ requestId, status, assignedTo: normalizedAssignee });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    return res.status(200).json({ message: 'Request updated', request });
  } catch (error) { return next(error); }
};

const deleteRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const deleted = await deleteRequestById(requestId);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    return res.status(200).json({ message: 'Request deleted' });
  } catch (error) { return next(error); }
};

const addCommentToRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const comment = await addComment({ requestId, userId, text });
    return res.status(201).json({ message: 'Comment added', comment });
  } catch (error) { return next(error); }
};

const getRequestComments = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const comments = await getCommentsByRequestId(requestId);
    return res.status(200).json({ comments });
  } catch (error) { return next(error); }
};

const getSystemAnalytics = async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const analytics = await getAnalytics();
    return res.status(200).json({ analytics });
  } catch (error) { return next(error); }
};

module.exports = {
  createServiceRequest,
  getUserRequests,
  getServiceRequestById,
  getAllServiceRequests,
  updateStatus,
  deleteRequest,
  addCommentToRequest,
  getRequestComments,
  getSystemAnalytics,
};