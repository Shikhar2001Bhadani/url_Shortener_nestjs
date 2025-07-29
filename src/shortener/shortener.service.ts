import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUrl, ShortUrlDocument } from './schemas/short-url.schema';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { generateCode } from '../common/decorators/get-user.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShortenerService {
  constructor(
    @InjectModel(ShortUrl.name) private shortUrlModel: Model<ShortUrlDocument>,
    private configService: ConfigService,
  ) {}

  async shortenUrl(dto: CreateShortUrlDto, user?: any) {
    const shortCode = dto.customCode || await this.generateUniqueCode();

    if (dto.customCode) {
      const existing = await this.shortUrlModel.findOne({ shortCode: dto.customCode });
      if (existing) {
        throw new ConflictException('Custom code already exists');
      }
    }

    const now = new Date();
    const newUrl = new this.shortUrlModel({
      originalUrl: dto.url,
      shortCode,
      user: user?.userId,
      createdAt: now,
    });

    await newUrl.save();

    console.log('Created new URL:', {
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      createdAtType: typeof newUrl.createdAt,
    });

    return {
      originalUrl: newUrl.originalUrl,
      shortUrl: `${this.configService.get('baseUrl')}/r/${shortCode}`,
      createdAt: newUrl.createdAt,
      createdAtFormatted: newUrl.createdAt ? newUrl.createdAt.toISOString() : null,
    };
  }

  async redirect(shortCode: string) {
    const doc = await this.shortUrlModel.findOne({ shortCode });
    if (!doc) throw new NotFoundException('Short URL not found');

    doc.clicks++;
    await doc.save();

    return doc.originalUrl;
  }

  async getStats(shortCode: string) {
    const doc = await this.shortUrlModel.findOne({ shortCode });
    if (!doc) throw new NotFoundException('Short URL not found');

    console.log('Document found:', {
      shortCode: doc.shortCode,
      createdAt: doc.createdAt,
      createdAtType: typeof doc.createdAt,
      hasCreatedAt: 'createdAt' in doc,
      docKeys: Object.keys(doc.toObject()),
    });

    // If createdAt doesn't exist, set it to the current time
    if (!doc.createdAt) {
      doc.createdAt = new Date();
      await doc.save();
    }

    return {
      originalUrl: doc.originalUrl,
      shortUrl: `${this.configService.get('baseUrl')}/r/${doc.shortCode}`,
      clicks: doc.clicks,
      createdAt: doc.createdAt,
      createdAtFormatted: doc.createdAt ? doc.createdAt.toISOString() : null,
    };
  }

  
  

  async updateExistingDocuments() {
    const docsWithoutCreatedAt = await this.shortUrlModel.find({ createdAt: { $exists: false } });
    console.log(`Found ${docsWithoutCreatedAt.length} documents without createdAt field`);
    
    for (const doc of docsWithoutCreatedAt) {
      doc.createdAt = new Date();
      await doc.save();
      console.log(`Updated document ${doc.shortCode} with createdAt: ${doc.createdAt}`);
    }
  }

  private async generateUniqueCode(): Promise<string> {
    let code;
    let exists;
    do {
      code = generateCode(6);
      exists = await this.shortUrlModel.findOne({ shortCode: code });
    } while (exists);
    return code;
  }
}
