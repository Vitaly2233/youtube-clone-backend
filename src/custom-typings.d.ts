import { User } from './user/entity/user.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user: User;
  }
}
