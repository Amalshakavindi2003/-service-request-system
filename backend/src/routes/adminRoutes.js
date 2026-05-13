const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllServiceRequests,
  updateStatus,
  deleteRequest,
  getSystemAnalytics,
} = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/requests', authenticateToken, authorizeAdmin, getAllServiceRequests);
router.get('/analytics', authenticateToken, authorizeAdmin, getSystemAnalytics);

router.patch(
  '/requests/:requestId/status',
  authenticateToken,
  authorizeAdmin,
  [
    param('requestId').isInt().withMessage('Request ID must be a number'),
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed'])
      .withMessage('Status must be Pending, In Progress, or Completed'),
  ],
  validateRequest,
  updateStatus
);

router.delete(
  '/requests/:requestId',
  authenticateToken,
  authorizeAdmin,
  [param('requestId').isInt().withMessage('Request ID must be a number')],
  validateRequest,
  deleteRequest
);

module.exports = router;