import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, existsSync, statSync, unlinkSync } from 'fs';
import { Repository } from 'typeorm';
import { UploadVideoDto } from './dto/upload-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entity/video.entity';
import { PreviewService } from '../preview/preview.service';
import * as mime from 'mime-types';
import { mkdir, writeFile } from 'fs/promises';

@Injectable()
export class VideoStreamService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    private previewService: PreviewService,
  ) {}

  async uploadVideo(userId: number, dto: UploadVideoDto) {
    const newVideo = await this.videoRepository.save({
      ...dto,
      user: { id: userId },
    });

    try {
      await mkdir(this.computeUsersPath(userId));
    } catch (e) {}
    const path = this.computeFilePath(userId, newVideo.id, dto.video.mimetype);
    await writeFile(path, dto.video.buffer);

    return true;
  }

  async getStream(response, userId: number, videoId: number, range?: string) {
    // const path = this.computeFilePath(userId, videoId);
    // const stat = statSync(path);
    // const fileSize = stat.size;
    // return this.getFileStream(fileSize, path, response, range);
  }

  private async getFileStream(
    fileSize: number,
    path: string,
    response,
    range?: string,
  ) {
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize)
        throw new HttpException('Range not appropriate', 416);

      const chunksize = end - start + 1;
      const file = createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      response.writeHead(206, head);
      file.pipe(response);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      response.writeHead(200, head);
      return createReadStream(path).pipe(response);
    }
  }

  async getById(id: number) {
    if (!id) throw new BadRequestException('id is missing');
    return this.videoRepository
      .createQueryBuilder('video')
      .where('video.id = :id', { id })
      .getOne();
  }

  async getRecentVideosWithPhotos(count: number) {
    if (count === 0) return [];
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .orderBy('video.uploadedAt')
      // .where('video.isPrivate = false')
      .take(count)
      .getMany();
  }

  async delete(id: number, userId: number) {
    // const result = await this.videoRepository.delete({ id });
    // if (result.affected === 0)
    //   throw new NotFoundException('video was not found');
    // unlinkSync(this.computeFilePath(userId, id));
  }

  async update(id: number, dto: UpdateVideoDto) {
    return this.videoRepository.save({ ...dto, id });
  }

  private async createUserFolder(userId: number) {}

  private computeFilePath(userId: number, fileId: number, mimetype: string) {
    return `${this.computeUsersPath(userId)}/${fileId}.${mime.extension(
      mimetype,
    )}`;
  }

  private computeUsersPath(userId: number) {
    return `./uploads/${userId}`;
  }
}
