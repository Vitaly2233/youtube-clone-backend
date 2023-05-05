import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from '../../common/validators/is-number';
import { Preview } from '../entity/preview.entity';

export class UploadPreviewDto extends PickType(Preview, ['name', 'video']) {
  @ApiProperty({ type: 'file' })
  preview: Express.Multer.File;

  @IsNumber()
  video: number;
}
