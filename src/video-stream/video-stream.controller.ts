import {
  Controller,
  Get,
  InternalServerErrorException,
  OnApplicationBootstrap,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { mkdir, mkdirSync, writeFile, writeFileSync } from 'fs';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { VideoStreamService } from './video-stream.service';

@Controller('api/video-stream')
@UseGuards(JwtGuard)
export class VideoStreamController implements OnApplicationBootstrap {
  constructor(private videoStreamService: VideoStreamService) {}
  onApplicationBootstrap() {}

  @Get()
  getVideo(@Req() req: Request, @Res() res) {
    return this.videoStreamService.getVideoStream(
      res,
      'test.mp4',
      req.headers.range,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req) {
    console.log(req.body);

    // try {
    //   mkdirSync(`./upload/${req.user.username}`);
    // } catch (e) {
    //   if (e.code !== 'EEXIST') throw new InternalServerErrorException();
    // }

    // writeFileSync(`./upload/${req.user.username}/.mp4`, file.buffer);
  }
}
