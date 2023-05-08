import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { VideoService } from '../video/services/video.service';
import { Dislike } from './entity/dislike.entity';
import { LikeService } from './like.service';

@Injectable()
export class DislikeService {
  constructor(
    @InjectRepository(Dislike)
    private readonly dislikeRepository: Repository<Dislike>,

    private readonly videoStreamService: VideoService,

    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,
  ) {}

  async toggleDislike(videoId: number, user: User) {
    const [alreadyLiked, alreadyDisliked, foundVideo] = await Promise.all([
      this.likeService.isAlreadyLiked(videoId, user.id),
      this.isAlreadyDisliked(videoId, user.id),
      this.videoStreamService.findOne({
        where: { id: videoId },
      }),
    ]);

    if (alreadyLiked) throw new ConflictException('video is already liked');
    if (!foundVideo) throw new NotFoundException('video was not found');

    if (alreadyDisliked) {
      await this.dislikeRepository.delete({ user: user.id, video: videoId });
      foundVideo.likeCount--;
    } else {
      await this.dislikeRepository.save({ user: user, video: videoId });
      foundVideo.likeCount++;
    }
    await this.videoStreamService.saveEntity(foundVideo);
  }

  async isAlreadyDisliked(videoId: number, userId: number) {
    return this.dislikeRepository.findOne({
      where: { user: userId, video: videoId },
    });
  }
}
