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

  @Column()
  likeCount: number;

  @Column()
  dislikeCount: number;

  @ManyToOne(() => User, (user) => user.videos)
  user?: User | number;

  @OneToOne(() => Preview, (preview) => preview.video)
  @JoinColumn()
  preview?: Preview;

  @OneToMany(() => Like, (like) => like.video)
  likes: Like[] | number[];

  @OneToMany(() => Dislike, (dislike) => dislike.video)
  dislikes: Dislike[] | number[];
}
