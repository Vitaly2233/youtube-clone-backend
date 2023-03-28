import { PartialType } from '@nestjs/swagger';
import { UploadVideoDto } from './upload-video.dto';

export class UpdateVideoDto extends PartialType(UploadVideoDto) {}
