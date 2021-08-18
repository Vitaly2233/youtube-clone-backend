import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { VideoService } from '../video.service';

@Injectable()
export class PrivateVideoGuard implements CanActivate {
  constructor(private videoService: VideoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const params = req.params;
    const userId = req.user.id;

    const video = await this.videoService.getById(params?.id);
    if (req.route.methods?.get) {
      video;
    }
    if (video.userId !== userId) return false;

    return true;
  }
}
