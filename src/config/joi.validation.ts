import * as joi from 'joi';

export const joiValidation = joi.object({
  PORT: joi.number().default(3005),
  DATABASE_URL: joi.required(),
  JWT_SECRET: joi.required(),
  nodeEnv: joi.required(),
  FIVE_DAYS_IN_MS: joi.required(),
  DEV_ENV: joi.required()
});
