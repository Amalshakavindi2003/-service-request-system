const demoStore = require('../store/demoStore');
const { isDemoMode } = require('../config/runtime');

const createRequest = (data) => (isDemoMode() ? demoStore.createRequest(data) : null);
const getRequestsByUserId = (id) => (isDemoMode() ? demoStore.getRequestsByUserId(id) : []);
const getRequestById = (id) => (isDemoMode() ? demoStore.getRequestById(id) : null);
const updateRequestStatus = (data) => (isDemoMode() ? demoStore.updateRequestStatus(data) : null);
const deleteRequestById = (id) => (isDemoMode() ? demoStore.deleteRequestById(id) : false);
const getAllRequests = (filters) => (isDemoMode() ? demoStore.getAllRequests(filters) : []);
const addComment = (data) => (isDemoMode() ? demoStore.addComment(data) : null);
const getCommentsByRequestId = (id) => (isDemoMode() ? demoStore.getCommentsByRequestId(id) : []);
const getAnalytics = () => (isDemoMode() ? demoStore.getAnalytics() : { total: 0, pending: 0, inProgress: 0, completed: 0, byCategory: {}, byPriority: {} });
const addAudit = (data) => (isDemoMode() ? demoStore.addAudit(data) : null);
const getAudits = () => (isDemoMode() ? demoStore.getAudits() : []);

module.exports = { createRequest, getRequestsByUserId, getRequestById, updateRequestStatus, deleteRequestById, getAllRequests, addComment, getCommentsByRequestId, getAnalytics, addAudit, getAudits };