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
import { DislikeService } from './dislike.service';
import { Like } from './entity/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    private readonly videoStreamService: VideoService,

    @Inject(forwardRef(() => DislikeService))
    private readonly dislikeService: DislikeService,
  ) {}

  async toggleLike(videoId: number, user: User) {
    const [alreadyDisliked, alreadyLiked, foundVideo] = await Promise.all([
      this.dislikeService.isAlreadyDisliked(videoId, user.id),
      this.isAlreadyLiked(videoId, user.id),
      this.videoStreamService.findOne({
        where: { id: videoId },
      }),
    ]);

    if (alreadyDisliked)
      throw new ConflictException('video is already disliked');
    if (!foundVideo) throw new NotFoundException('video was not found');

    if (alreadyLiked) {
      await this.likeRepository.delete({ user: user.id, video: videoId });
      foundVideo.likeCount--;
    } else {
      await this.likeRepository.save({ user: user, video: videoId });
      foundVideo.likeCount++;
    }
    await this.videoStreamService.saveEntity(foundVideo);
  }

  async isAlreadyLiked(videoId: number, userId: number) {
    return this.likeRepository.findOne({
      where: { user: userId, video: videoId },
    });
  }
}
