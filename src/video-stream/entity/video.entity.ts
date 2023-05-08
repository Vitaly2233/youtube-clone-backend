import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.videos)
  user?: User | number;

  @OneToOne(() => Preview, (preview) => preview.video)
  @JoinColumn()
  preview?: Preview;
}
