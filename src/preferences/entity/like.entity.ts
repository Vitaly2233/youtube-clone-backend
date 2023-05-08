import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Video } from '../../video-stream/entity/video.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User | number;

  @ManyToOne(() => Video, (video) => video.likes)
  video: Video | number;
}
