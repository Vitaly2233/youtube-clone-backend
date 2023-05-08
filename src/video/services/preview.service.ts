import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { Repository } from 'typeorm';
import { EntityService } from '../../common/abstract/entity-service.abstract';
import { UploadPreviewDto } from '../dto/upload-preview.dto';
import { Preview } from '../entity/preview.entity';
import { EFileType } from '../enum/file-type.enum';
import { ComputationService } from './computation.service';
import { VideoService } from './video.service';

@Injectable()
export class PreviewService extends EntityService<Preview> {
  constructor(
    @InjectRepository(Preview)
    private readonly previewRepository: Repository<Preview>,

    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,

    private readonly computationService: ComputationService,
  ) {
    super(previewRepository);
  }

  async uploadPreview(dto: UploadPreviewDto) {
    const videoId = dto.video;

    const video = await this.videoService.findOne({
      where: { id: videoId },
      relations: ['preview'],
    });

    if (!video) throw new NotFoundException('video not found');
    if (video.preview)
      throw new ConflictException('video already has a preview');

    const newPreview = await this.previewRepository.save(dto);
    const fileUrl = this.computationService.computeFileUrl(
      EFileType.preview,
      this.computationService.computeFileName(
        newPreview.id,
        dto.preview.mimetype,
      ),
    );

    video.preview = newPreview;
    newPreview.link = fileUrl;

    await this.videoService.saveEntity(video);
    await this.previewRepository.save(newPreview);

    try {
      await mkdir(
        this.computationService.computeFileFolderPath(EFileType.preview),
      );
    } catch (e) {}

    const path = this.computationService.computeFilePath(
      EFileType.preview,
      newPreview.id,
      dto.preview.mimetype,
    );
    await writeFile(path, dto.preview.buffer);

    return true;
  }

  getPreviewFile(fileName: string) {
    const path = `${this.computationService.computeFileFolderPath(
      EFileType.preview,
    )}/${fileName}`;
    try {
      return createReadStream(path);
    } catch (e) {
      throw new NotFoundException('file not found');
    }
  }

  async deletePreview(id: number) {
    try {
      const path = await this.computationService.computeFilePathByFileName(
        id,
        EFileType.preview,
      );
      await unlink(path);
    } catch (e) {
      throw new NotFoundException('preview not found');
    }
    await this.previewRepository.delete({ id });
  }
}
