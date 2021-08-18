import { Exclude } from 'class-transformer';
import { Video } from 'src/video/entity/video.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
