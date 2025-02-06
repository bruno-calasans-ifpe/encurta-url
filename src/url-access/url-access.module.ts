import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlAccess } from './url-access.entity';
import { UrlAccessService } from './url-access.service';
import { UrlAccessController } from './url-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UrlAccess])],
  providers: [UrlAccessService],
  controllers: [UrlAccessController],
})
export class UrlAccessModule {}
