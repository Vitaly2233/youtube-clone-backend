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
import { mkdir, writeFile } from 'fs/promises';
import { UploadPreviewDto } from './dto/upload-preview.dto';
import { Preview } from './entity/preview.entity';
import { User } from '../user/entity/user.entity';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { FileType } from './enum/file-type.enum';

@Injectable()
export class VideoStreamService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Preview)
    private readonly previewRepository: Repository<Preview>,
  ) {}

  async uploadVideo(userId: number, dto: UploadVideoDto) {
    const newVideo = await this.videoRepository.save({
      ...dto,
      user: { id: userId },
    });

    try {
      await mkdir(this.computeVideoPath());
    } catch (e) {}
    const path = this.computeVideoFilePath(newVideo.id, dto.video.mimetype);
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
    video.preview = newPreview;
    await this.videoRepository.save(video);

    try {
      await mkdir(this.computePreviewPath());
    } catch (e) {}
    const path = this.comptePreviewFilePath(
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
    const path = `${this.computeVideoPath()}/${fileName}`;
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

  getPreviewStream(fileName: string) {
    const path = `${this.computePreviewPath()}/${fileName}`;
    try {
      return createReadStream(path);
    } catch (e) {
      throw new NotFoundException('file not found');
    }
  }

  private computeVideoFilePath(fileId: number, mimetype: string) {
    const fileName = mime.extension(mimetype);
    return `${this.computeVideoPath()}/${fileId}.${fileName}`;
  }

  private comptePreviewFilePath(fileId: number, mimetype: string) {
    const fileName = mime.extension(mimetype);
    return `${this.computePreviewPath()}/${fileId}.${fileName}`;
  }

  private computeVideoPath() {
    return `./uploads/videos`;
  }

  private computePreviewPath() {
    return `./uploads/previews`;
  }

  private computeFileUrl(type: FileType) {
    //TODO make computation more flexible by adding file type (video or preview)
  }
}
