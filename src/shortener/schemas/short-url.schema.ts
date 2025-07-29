import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ShortUrlDocument = ShortUrl & Document;

@Schema()
export class ShortUrl {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ default: Date.now, type: Date })
  createdAt: Date;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User | mongoose.Types.ObjectId;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);

// Ensure timestamps are properly handled
ShortUrlSchema.set('timestamps', false); // Disable automatic timestamps since we're handling createdAt manually
