import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from '../../common/validators/is-number';
import { Video } from './video.entity';

@Entity()
export class Preview {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @IsString()
  @IsOptional()
  name?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt?: Date;

  @OneToOne(() => Video, (video) => video.preview)
  @IsNumber()
  video: Video | number;
}
