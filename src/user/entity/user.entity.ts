import { Video } from 'src/video-stream/entity/video.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dislike } from '../../preferences/entity/dislike.entity';
import { Like } from '../../preferences/entity/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Video, (video) => video.user, { cascade: true })
  videos: Video[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.user)
  dislikes: Dislike[];
}
