import { registerAs } from '@nestjs/config';

export default registerAs(
  'cache',
  (): Record<string, any> => ({
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisTTL: +process.env.REDIS_TTL,
  }),
);