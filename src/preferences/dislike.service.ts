import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { VideoStreamService } from '../video-stream/video-stream.service';
import { Dislike } from './entity/dislike.entity';

@Injectable()
export class DislikeService {
  constructor(
    @InjectRepository(Dislike)
    private readonly dislikeRepository: Repository<Dislike>,

    private readonly videoStreamService: VideoStreamService,
  ) {}

  async toggleDislike(videoId: number, user: User) {
    const [foundDislike, foundVideo] = await Promise.all([
      this.dislikeRepository.findOne({
        where: { user: user.id, video: videoId },
      }),
      this.videoStreamService.findOne({
        where: { id: videoId },
      }),
    ]);

    if (!foundVideo) throw new NotFoundException('video was not found');

    if (foundDislike) {
      await this.dislikeRepository.delete({ user: user.id, video: videoId });
      foundVideo.likeCount--;
    } else {
      await this.dislikeRepository.save({ user: user, video: videoId });
      foundVideo.likeCount++;
    }
    await this.videoStreamService.saveEntity(foundVideo);
  }
}
