import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadVideoDto } from './dto/upload-video.dto';
import { Video } from './entity/video.entity';
import * as mime from 'mime-types';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { UploadPreviewDto } from './dto/upload-preview.dto';
import { Preview } from './entity/preview.entity';
import { User } from '../user/entity/user.entity';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { FileType } from './enum/file-type.enum';
import config from '../common/config';
import { getFilePathByName } from '../common/helpers/get-file-path-by-name';
import { EntityService } from '../common/abstract/entity-service.abstract';

@Injectable()
export class VideoStreamService extends EntityService<Video> {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Preview)
    private readonly previewRepository: Repository<Preview>,
  ) {
    super(videoRepository);
  }

  async uploadVideo(userId: number, dto: UploadVideoDto) {
    const newVideo = await this.videoRepository.save({
      ...dto,
      user: { id: userId },
    });

    const fileUrl = this.computeFileUrl(
      FileType.video,
      this.computeFileName(newVideo.id, dto.video.mimetype),
    );

    newVideo.link = fileUrl;

    await this.videoRepository.save(newVideo);

    try {
      await mkdir(this.computeFileFolderPath(FileType.video));
    } catch (e) {}
    const path = this.computeFilePath(
      FileType.video,
      newVideo.id,
      dto.video.mimetype,
    );
    await writeFile(path, dto.video.buffer);

    return true;
  }

  async uploadPreview(dto: UploadPreviewDto) {
    const videoId = dto.video;

    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['preview'],
    });

    if (!video) throw new NotFoundException('video not found');
    if (video.preview)
      throw new ConflictException('video already has a preview');

    const newPreview = await this.previewRepository.save(dto);
    const fileUrl = this.computeFileUrl(
      FileType.preview,
      this.computeFileName(newPreview.id, dto.preview.mimetype),
    );

    video.preview = newPreview;
    newPreview.link = fileUrl;

    await this.videoRepository.save(video);
    await this.previewRepository.save(newPreview);

    try {
      await mkdir(this.computeFileFolderPath(FileType.preview));
    } catch (e) {}

    const path = this.computeFilePath(
      FileType.preview,
      newPreview.id,
      dto.preview.mimetype,
    );
    await writeFile(path, dto.preview.buffer);

    return true;
  }

  async getUserVideos(user: User) {
    return this.videoRepository.find({
      where: { user: user.id },
      relations: { preview: true },
    });
  }

  streamVideo(fileName: string, headers, res: Response) {
    const path = `${this.computeFileFolderPath(FileType.video)}/${fileName}`;
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

  getPreviewFile(fileName: string) {
    const path = `${this.computeFileFolderPath(FileType.preview)}/${fileName}`;
    try {
      return createReadStream(path);
    } catch (e) {
      throw new NotFoundException('file not found');
    }
  }

  async deleteVideo(id: number) {
    try {
      const path = await this.computeFilePathByFileName(id, FileType.video);
      await unlink(path);
    } catch (e) {
      throw new NotFoundException('video not found');
    }

    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['preview'],
    });

    if (video?.preview?.id) await this.deletePreview(video.preview?.id);
    await this.videoRepository.delete({ id });
  }

  async deletePreview(id: number) {
    try {
      const path = await this.computeFilePathByFileName(id, FileType.preview);
      await unlink(path);
    } catch (e) {
      throw new NotFoundException('preview not found');
    }
    await this.previewRepository.delete({ id });
  }

  private computeFilePath(
    fileType: FileType,
    fileId: number,
    mimetype: string,
  ) {
    const folderPath = this.computeFileFolderPath(fileType);
    const fileName = this.computeFileName(fileId, mimetype);
    return `${folderPath}/${fileName}`;
  }

  private async computeFilePathByFileName(id: number, fileType: FileType) {
    const fileName = await getFilePathByName(
      id.toString(),
      this.computeFileFolderPath(fileType),
    );
    return `${this.computeFileFolderPath(fileType)}/${fileName}`;
  }

  private computeFileFolderPath(fileType: FileType) {
    if (fileType === FileType.preview) return './uploads/previews';
    else return './uploads/videos';
  }

  private computeFileName(fileId: number, mimetype: string) {
    const fileExtension = mime.extension(mimetype);
    return `${fileId}.${fileExtension}`;
  }

  private computeFileUrl(type: FileType, fileName: string) {
    if (type === FileType.preview) {
      return `${config.SERVER_URL}/video-stream/preview/${fileName}`;
    } else {
      return `${config.SERVER_URL}/video-stream/${fileName}`;
    }
  }
}
