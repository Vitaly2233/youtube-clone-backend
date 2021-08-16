import { UserDocument } from 'src/user/schema/user.schema';

export interface IUserData {
  readonly user?: UserDocument;
  readonly token?: string;
}
