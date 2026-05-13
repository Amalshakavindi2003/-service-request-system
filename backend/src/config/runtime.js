const env = require('./env');

const isDemoMode = () => env.demoMode;

module.exports = { isDemoMode };
