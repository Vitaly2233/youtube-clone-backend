import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Video } from '../../video/entity/video.entity';

@Entity()
export class Dislike {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.dislikes, { onDelete: 'CASCADE' })
  user: User | number;

  @ManyToOne(() => Video, (video) => video.dislikes, { onDelete: 'CASCADE' })
  video: Video | number;
}
