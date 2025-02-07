import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlAccess } from './url-access.entity';
import { UrlAccessService } from './url-access.service';
import { UrlAccessController } from './url-access.controller';
import { Url } from 'src/url/url.entity';
import { UrlService } from 'src/url/url.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlAccess]),
    TypeOrmModule.forFeature([Url]),
  ],
  providers: [UrlAccessService, UrlService],
  controllers: [UrlAccessController],
})
export class UrlAccessModule {}
