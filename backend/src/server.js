const app = require('./app');
const pool = require('./config/db');
const env = require('./config/env');
const { isDemoMode } = require('./config/runtime');

const startServer = async () => {
  try {
    if (!isDemoMode() && pool) {
      try {
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');
      } catch (error) {
        console.warn('Database connection failed, falling back to demo mode:', error.message);
        env.demoMode = true;
      }
    }

    if (isDemoMode()) {
      console.log('Demo mode enabled - using in-memory auth/data');
    }

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
