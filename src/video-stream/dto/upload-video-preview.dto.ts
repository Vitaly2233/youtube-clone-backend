import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from '../../common/validators/is-number';

export class UploadVideoPreviewDto {
  @IsNumber()
  videoId: number;

  @ApiProperty({ type: 'file' })
  preview: Express.Multer.File;
}
