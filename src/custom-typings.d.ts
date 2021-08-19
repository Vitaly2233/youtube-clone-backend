import { User } from './user/entity/user.entity';
import { Video } from './file/entity/video.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user: User;
    video?: Video;
  }
}
