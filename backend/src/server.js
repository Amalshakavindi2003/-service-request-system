require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const { isDemoMode } = require('./config/runtime');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!isDemoMode() && pool) {
      await pool.query('SELECT NOW()');
      console.log('Database connection successful');
    } else {
      console.log('Demo mode enabled - using in-memory auth/data');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();