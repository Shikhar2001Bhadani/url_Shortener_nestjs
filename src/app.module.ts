import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ShortenerModule } from './shortener/shortener.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener'),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,      // 60 seconds window
          limit: 10,     // Max 10 requests per window per IP
        },
      ],
    }),
    AuthModule,
    ShortenerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
