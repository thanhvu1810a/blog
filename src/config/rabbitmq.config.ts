import { registerAs } from '@nestjs/config';

export default registerAs(
  'rabbitmq',
  (): Record<string, any> => ({
    rabbitmq: {
      user: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
      host: process.env.RABBITMQ_HOST,
      queue: process.env.RABBITMQ_QUEUE_NAME,
    },
  }),
);