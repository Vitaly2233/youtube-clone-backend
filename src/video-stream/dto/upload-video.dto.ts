import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsBoolean } from '../../common/validators/is-boolean';
import { Video } from '../entity/video.entity';

export class UploadVideoDto extends PickType(Video, [
  'name',
  'description',
  'isPrivate',
]) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ type: 'file' })
  video: Express.Multer.File;
}
