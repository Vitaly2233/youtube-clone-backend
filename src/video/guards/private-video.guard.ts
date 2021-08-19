import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { VideoService } from '../video.service';

@Injectable()
export class PrivateVideoGuard implements CanActivate {
  constructor(private videoService: VideoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const params = req.params;
    const userId = req.user.id;

    if (req.route.methods?.post) return true;
    const video = await this.videoService.getById(parseInt(params['id'], 10));
    if (!video) throw new NotFoundException('video is not found');

    if (req.route.methods?.get) {
      if (video.isPrivate && video.userId !== userId)
        throw new ForbiddenException('private video');
      req.video = video;
      return true;
    }
    if (video?.userId !== userId) return false;

    return true;
  }
}
