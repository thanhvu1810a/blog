import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  {redisStore} from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            socket: {
              host: configService.get('cache.redisHost'),
              port: +configService.get('cache.redisPort'),
            },
          }),
          ttl: +configService.get('cache.redisTTL'),
        } as CacheModuleAsyncOptions;
      },
    }),
  ],
})
export class CacheConfigModule {}
