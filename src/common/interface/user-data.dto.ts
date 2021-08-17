import { User } from 'src/user/entity/user.entity';

export interface IUserData {
  readonly user?: User;
  readonly token?: string;
}
