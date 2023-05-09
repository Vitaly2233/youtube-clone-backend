import { Module } from '@nestjs/common';
import { VideoStreamController } from './video.controller';
import { Video } from './entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Preview } from './entity/preview.entity';
import { ComputationService } from './services/computation.service';
import { PreviewService } from './services/preview.service';
import { VideoService } from './services/video.service';
import { WatchHistoryItem } from './entity/watch-history-item';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Preview, WatchHistoryItem]),
    UserModule,
  ],
  providers: [VideoService, PreviewService, ComputationService],
  controllers: [VideoStreamController],
  exports: [VideoService],
})
export class VideoStreamModule {}
