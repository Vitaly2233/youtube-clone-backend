import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dislike } from '../../preferences/entity/dislike.entity';
import { Like } from '../../preferences/entity/like.entity';
import { Preview } from './preview.entity';
import { WatchHistoryItem } from './watch-history-item';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: null })
  link?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt?: Date;

  @Column({ default: '0' })
  likeCount?: number;

  @Column({ default: '0' })
  dislikeCount?: number;

  @Column({ default: '0' })
  viewsCount?: number;

  @ManyToOne(() => User, (user) => user.videos, { onDelete: 'CASCADE' })
  user?: User | number;

  @OneToOne(() => Preview, (preview) => preview.video)
  @JoinColumn()
  preview?: Preview;

  @OneToMany(() => Like, (like) => like.video)
  likes: Like[] | number[];

  @OneToMany(() => Dislike, (dislike) => dislike.video)
  dislikes: Dislike[] | number[];

  @OneToMany(() => WatchHistoryItem, (item) => item.video)
  watchHistoryItems: WatchHistoryItem[] | number[];
}
