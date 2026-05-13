const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const parseBoolean = (value, fallback = false) => {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return fallback;
};

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requiredWhenLive = (name, value) => {
  if (!value) {
    throw new Error(`${name} is required when DEMO_MODE is false.`);
  }
  return value;
};

const env = {
  port: parseNumber(process.env.PORT, 5000),
  clientUrl: normalize(process.env.CLIENT_URL) || 'http://localhost:5173',
  demoMode: parseBoolean(process.env.DEMO_MODE, false),
  jwtSecret: normalize(process.env.JWT_SECRET),
  jwtExpiresIn: normalize(process.env.JWT_EXPIRES_IN) || '1d',
  databaseUrl: normalize(process.env.DATABASE_URL),
  dbSsl: parseBoolean(process.env.DB_SSL, true),
  dbHost: normalize(process.env.DB_HOST),
  dbPort: parseNumber(process.env.DB_PORT, 5432),
  dbUser: normalize(process.env.DB_USER),
  dbPassword: normalize(process.env.DB_PASSWORD),
  dbName: normalize(process.env.DB_NAME),
};

if (!env.demoMode) {
  requiredWhenLive('JWT_SECRET', env.jwtSecret);

  const hasDatabaseUrl = Boolean(env.databaseUrl);
  const hasSplitDbConfig = Boolean(env.dbHost && env.dbUser && env.dbPassword && env.dbName);

  if (!hasDatabaseUrl && !hasSplitDbConfig) {
    throw new Error(
      'Database configuration missing. Set DATABASE_URL or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME.'
    );
  }
}

module.exports = env;