import { OmitType } from '@nestjs/swagger';
import { Video } from '../entity/video.entity';

export class CreateVideoDto extends OmitType(Video, ['user', 'id', 'userId']) {}
