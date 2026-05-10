const express = require('express');
const { body, param } = require('express-validator');
const {
  getRequestsForAdmin,
  changeRequestStatus,
  removeRequest,
} = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/requests', authenticateToken, authorizeAdmin, getRequestsForAdmin);

router.patch(
  '/requests/:id/status',
  authenticateToken,
  authorizeAdmin,
  [
    param('id').isInt().withMessage('Request ID must be a number'),
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed'])
      .withMessage('Status must be Pending, In Progress, or Completed'),
  ],
  validateRequest,
  changeRequestStatus
);

router.delete(
  '/requests/:id',
  authenticateToken,
  authorizeAdmin,
  [param('id').isInt().withMessage('Request ID must be a number')],
  validateRequest,
  removeRequest
);

module.exports = router;