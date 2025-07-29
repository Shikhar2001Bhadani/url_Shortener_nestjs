import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  customCode?: string;
}
