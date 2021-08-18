import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { Repository } from 'typeorm';
import { Video } from './entity/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  async getStream(response, userId: number, videoId: number, range?: string) {
    const path = this.getPath(userId, videoId);
    const stat = statSync(path);
    const fileSize = stat.size;

    return this.getFileStream(fileSize, path, response, range);
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
        throw new HttpException('Range not satisfilable', 416);

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

  async create(name: string, description: string, userId: number) {
    const newVideo = { name, description, userId };
    try {
      return await this.videoRepository.save(newVideo);
    } catch (e) {
      throw new ConflictException('video is not saved');
    }
  }

  async delete(id: number, userId: number) {
    const res = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.id = :id', { id })
      .getOne();
    console.log(res);
    return res;

    // const result = await this.videoRepository.delete({ id });

    // if (result.affected === 0)
    //   throw new NotFoundException('video was not found');

    // unlinkSync(this.getPath(userId, id));
  }

  async upload(
    userId: number,
    name: string,
    description: string,
    fileBuffer: Buffer,
  ) {
    const video = await this.create(name, description, userId);
    const path = this.getPath(userId, video.id);
    try {
      mkdirSync(`./upload/${userId}`);
    } catch (e) {}

    if (!existsSync(path)) writeFileSync(path, fileBuffer);
    else throw new ConflictException('file with the name alreay exists');

    return video;
  }

  async update(id: number, newName?: string, description?: string) {
    return await this.videoRepository.save({ id, name: newName, description });
  }

  private getPath(userId: number, videoId: number) {
    return `./upload/${userId}/${videoId}.mp4`;
  }
}