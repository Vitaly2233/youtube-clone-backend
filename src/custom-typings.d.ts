import { User } from './user/entity/user.entity';
import { Video } from './video/entity/video.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user: User;
    video?: Video;
  }
}
