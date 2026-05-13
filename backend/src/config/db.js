const { Pool } = require('pg');
const env = require('./env');

let pool = null;

if (!env.demoMode) {
  const ssl = env.dbSsl ? { rejectUnauthorized: false } : false;

  if (env.databaseUrl) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl,
    });
  } else {
    pool = new Pool({
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      ssl,
    });
  }
}

module.exports = pool;
