import { Controller, Post, Body, Get, Param, Res, HttpCode, Redirect, NotFoundException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ShortenerService } from './shortener.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('URL Shortener')
@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post('/api/shorten')
  async shorten(@Body() dto: CreateShortUrlDto) {
    return this.shortenerService.shortenUrl(dto);
  }

  @Get('/r/:shortCode')
  @Redirect()
  async redirect(@Param('shortCode') code: string) {
    const url = await this.shortenerService.redirect(code);
    return { url, statusCode: 302 };
  }

  @Get('/api/stats/:shortCode')
  async stats(@Param('shortCode') code: string) {
    return this.shortenerService.getStats(code);
  }

  @Post('/api/update-existing-documents')
  async updateExistingDocuments() {
    return this.shortenerService.updateExistingDocuments();
  }
  
}
