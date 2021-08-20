import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PreviewController } from './preview.controller';
import { PreviewService } from './preview.service';

@Module({
  imports: [HttpModule],
  providers: [PreviewService],
  controllers: [PreviewController],
  exports: [PreviewService],
})
export class PreviewModule {}
