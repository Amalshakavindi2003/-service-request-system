const PLACEHOLDERS = new Set([
  'your_supabase_host',
  'your_supabase_password',
  'replace_with_a_long_random_secret',
]);

const hasPlaceholder = (value) => !value || PLACEHOLDERS.has(String(value).trim());

const isDemoMode = () => {
  return (
    process.env.DEMO_MODE === 'true' ||
    hasPlaceholder(process.env.DB_HOST) ||
    hasPlaceholder(process.env.DB_PASSWORD) ||
    hasPlaceholder(process.env.JWT_SECRET)
  );
};

module.exports = { isDemoMode };