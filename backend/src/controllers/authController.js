const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const { isDemoMode } = require('../config/runtime');
const demoStore = require('../store/demoStore');

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser({ fullName, email, passwordHash, role: 'user' });

    const token = generateToken({ id: newUser.id, role: newUser.role });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser,
      mode: isDemoMode() ? 'demo' : 'live',
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordHash = user.password_hash;
    const isPasswordValid = isDemoMode()
      ? await demoStore.verifyPassword(password, passwordHash)
      : await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      mode: isDemoMode() ? 'demo' : 'live',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};