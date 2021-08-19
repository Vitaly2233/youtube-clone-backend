import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
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
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entity/video.entity';
import { PreviewService } from './preview.service';
import { UploadFilesTypes } from './video.controller';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    private previewService: PreviewService,
  ) {}

  async getStream(response, userId: number, videoId: number, range?: string) {
    const path = this.getFilePath(userId, videoId);
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

  async getById(id: number) {
    if (!id) throw new BadRequestException('id is missing');
    return await this.videoRepository
      .createQueryBuilder('video')
      .where('video.id = :id', { id })
      .getOne();
  }

  async upload(
    files: UploadFilesTypes,
    userId: number,
    isPrivate: boolean,
    dto: CreateVideoDto,
  ) {
    const newVideo = await this.create({ ...dto, userId, isPrivate });

    const path = this.getFilePath(userId, newVideo.id);
    try {
      mkdirSync(`./upload/${userId}`);
    } catch (e) {}

    if (!existsSync(path)) writeFileSync(path, files.video[0].buffer);
    else throw new ConflictException('file with the name alreay exists');
    if (files.preview.length !== 0) {
      this.previewService.upload(userId, newVideo.id, files.preview[0].buffer);
    }

    return newVideo;
  }

  async create(createVideo: Video) {
    try {
      return await this.videoRepository.save({ ...createVideo });
    } catch (e) {
      throw new ConflictException('video is not saved');
    }
  }

  async delete(id: number, userId: number) {
    // const result = await this.videoRepository.delete({ id });
    // if (result.affected === 0)
    //   throw new NotFoundException('video was not found');
    // unlinkSync(this.getFilePath(userId, id));
  }

  async update(id: number, dto: UpdateVideoDto) {
    return await this.videoRepository.save({ ...dto, id });
  }

  private getFilePath(userId: number, fileId: number) {
    return `./upload/${userId}/${fileId}.mp4`;
  }
}
