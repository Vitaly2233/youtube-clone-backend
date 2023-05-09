import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Video } from './video.entity';

@Entity()
export class WatchHistoryItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.watchHistoryItems)
  user: User | number;

  @ManyToOne(() => Video, (video) => video.watchHistoryItems)
  video: Video | number;
}
