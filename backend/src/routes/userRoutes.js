const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

router.put(
  '/profile',
  authenticateToken,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('department').optional().trim().isLength({ max: 100 }),
    body('phone').optional().trim().isLength({ max: 30 }),
  ],
  validateRequest,
  updateProfile
);

module.exports = router;