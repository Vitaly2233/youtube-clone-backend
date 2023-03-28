import { User } from './user/entity/user.entity';
import { Video } from './video-stream/entity/video.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user: User;
    video?: Video;
  }
}
