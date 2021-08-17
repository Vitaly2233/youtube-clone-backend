import { Module } from '@nestjs/common';
import { VideoStreamService } from './video-stream.service';
import { VideoStreamController } from './video-stream.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [VideoStreamService],
  controllers: [VideoStreamController],
})
export class VideoStreamModule {}
