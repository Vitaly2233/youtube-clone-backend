import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { VideoStreamService } from '../video-stream/video-stream.service';
import { Like } from './entity/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    private readonly videoStreamService: VideoStreamService,
  ) {}

  async toggleLike(videoId: number, user: User) {
    const [foundLike, foundVideo] = await Promise.all([
      this.likeRepository.findOne({
        where: { user: user.id, video: videoId },
      }),
      this.videoStreamService.findOne({
        where: { id: videoId },
      }),
    ]);

    if (!foundVideo) throw new NotFoundException('video was not found');

    if (foundLike) {
      await this.likeRepository.delete({ user: user.id, video: videoId });
      foundVideo.likeCount--;
    } else {
      await this.likeRepository.save({ user: user, video: videoId });
      foundVideo.likeCount++;
    }
    await this.videoStreamService.saveEntity(foundVideo);
  }
}
