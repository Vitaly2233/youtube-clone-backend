import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt?: Date;

  @ManyToOne(() => User, (user) => user.videos)
  user?: User;
}
