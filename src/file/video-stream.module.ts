import { Module } from '@nestjs/common';
import { VideoStreamService } from './video-stream.service';
import { VideoStreamController } from './video-stream.controller';
import { Video } from './entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PreviewModule } from 'src/preview/preview.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), UserModule, PreviewModule],
  providers: [VideoStreamService],
  controllers: [VideoStreamController],
})
export class VideoStreamModule {}
