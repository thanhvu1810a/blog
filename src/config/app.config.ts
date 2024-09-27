import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'nodejs',

    globalPrefix: '/api',

    http: {
      enable: true,
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT ? +process.env.HTTP_PORT : 8000,
    },
  }),
);