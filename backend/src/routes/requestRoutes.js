const express = require('express');
const { body } = require('express-validator');
const {
  createServiceRequest,
  getUserRequests,
  getServiceRequestById,
  getAllServiceRequests,
  updateStatus,
  deleteRequest,
  addCommentToRequest,
  getRequestComments,
  getSystemAnalytics,
  exportRequestsCsv,
  getAuditLogs,
} = require('../controllers/requestController');
const { validateRequest } = require('../middleware/validateRequest');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('priority').trim().notEmpty().withMessage('Priority is required'),
  ],
  validateRequest,
  createServiceRequest
);

router.get('/my-requests', getUserRequests);
router.get('/all', getAllServiceRequests);
router.get('/export', exportRequestsCsv);
router.get('/admin/analytics', getSystemAnalytics);
router.get('/admin/audit', getAuditLogs);
router.get('/:requestId', getServiceRequestById);

router.patch('/:requestId/status', updateStatus);
router.delete('/:requestId', deleteRequest);

router.post(
  '/:requestId/comments',
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  validateRequest,
  addCommentToRequest
);

router.get('/:requestId/comments', getRequestComments);

module.exports = router;