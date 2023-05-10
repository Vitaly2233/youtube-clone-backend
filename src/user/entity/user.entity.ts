import { IsString } from 'class-validator';
import { Video } from 'src/video/entity/video.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dislike } from '../../preferences/entity/dislike.entity';
import { Like } from '../../preferences/entity/like.entity';
import { WatchHistoryItem } from '../../video/entity/watch-history-item';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  username: string;

  @IsString()
  @Column({ nullable: true })
  firstName: string;

  @IsString()
  @Column({ nullable: true })
  lastName: string;

  @IsString()
  @Column({ nullable: true })
  birthDate: Date;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.user, { cascade: true })
  dislikes: Dislike[];

  @OneToMany(() => WatchHistoryItem, (item) => item.user, { cascade: true })
  watchHistoryItems: WatchHistoryItem[] | number[];
}
