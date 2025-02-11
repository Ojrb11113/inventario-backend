export const envs = () => ({
  urlDB: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.nodeEnv,
  devEnv: process.env.DEV_ENV,
  days: process.env.FIVE_DAYS_IN_MS
});
