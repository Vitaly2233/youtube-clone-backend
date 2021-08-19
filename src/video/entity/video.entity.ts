import { ParseBoolPipe } from '@nestjs/common';
import { IsBoolean, IsString } from 'class-validator';
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

  @ManyToOne(() => User, (user) => user.videos)
  user?: User;

  @Column()
  userId: number;
}
