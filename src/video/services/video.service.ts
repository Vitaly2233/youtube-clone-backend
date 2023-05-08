import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { ComputationService } from './computation.service';
import { PreviewService } from './preview.service';
import { Video } from '../entity/video.entity';
import { EntityService } from '../../common/abstract/entity-service.abstract';
import { UploadVideoDto } from '../dto/upload-video.dto';
import { EFileType } from '../enum/file-type.enum';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class VideoService extends EntityService<Video> {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @Inject(forwardRef(() => PreviewService))
    private readonly previewService: PreviewService,

    private readonly computationService: ComputationService,
  ) {
    super(videoRepository);
  }

  async uploadVideo(userId: number, dto: UploadVideoDto) {
    const newVideo = await this.videoRepository.save({
      ...dto,
      user: { id: userId },
    });

    const fileUrl = this.computationService.computeFileUrl(
      EFileType.video,
      this.computationService.computeFileName(newVideo.id, dto.video.mimetype),
    );

    newVideo.link = fileUrl;

    await this.videoRepository.save(newVideo);

    try {
      await mkdir(
        this.computationService.computeFileFolderPath(EFileType.video),
      );
    } catch (e) {}
    const path = this.computationService.computeFilePath(
      EFileType.video,
      newVideo.id,
      dto.video.mimetype,
    );
    await writeFile(path, dto.video.buffer);

    return true;
  }

  async getUserVideos(user: User) {
    return this.videoRepository.find({
      where: { user: user.id },
      relations: { preview: true },
    });
  }

  streamVideo(fileName: string, headers, res: Response) {
    const path = `${this.computationService.computeFileFolderPath(
      EFileType.video,
    )}/${fileName}`;
    const { size } = statSync(path);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamFile = createReadStream(path, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      readStreamFile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head);
      createReadStream(path).pipe(res);
    }
  }

  async deleteVideo(id: number) {
    try {
      const path = await this.computationService.computeFilePathByFileName(
        id,
        EFileType.video,
      );
      await unlink(path);
    } catch (e) {
      throw new NotFoundException('video not found');
    }

    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['preview'],
    });

    if (video?.preview?.id) {
      await this.previewService.deletePreview(video.preview?.id);
    }
    await this.videoRepository.delete({ id });
  }
}
