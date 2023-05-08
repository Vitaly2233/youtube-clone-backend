import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { PreferencesController } from './preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { Dislike } from './entity/dislike.entity';
import { VideoStreamModule } from '../video/video.module';
import { DislikeService } from './dislike.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Dislike]), VideoStreamModule],
  controllers: [PreferencesController],
  providers: [LikeService, DislikeService],
})
export class PreferencesModule {}
