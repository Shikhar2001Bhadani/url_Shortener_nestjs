import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { ShortUrl, ShortUrlSchema } from './schemas/short-url.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: ShortUrl.name, schema: ShortUrlSchema },
      { name: 'User', schema: UserSchema }
    ]),
  ],
  controllers: [ShortenerController],
  providers: [ShortenerService],
})
export class ShortenerModule {}
