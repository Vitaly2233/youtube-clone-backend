import { Module } from '@nestjs/common';
import { VideoStreamService } from './video-stream.service';
import { VideoStreamController } from './video-stream.controller';
import { Video } from './entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Preview } from './entity/preview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Preview]), UserModule],
  providers: [VideoStreamService],
  controllers: [VideoStreamController],
})
export class VideoStreamModule {}
