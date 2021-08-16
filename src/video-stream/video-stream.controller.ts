import {
  BadRequestException,
  Controller,
  Get,
  OnApplicationBootstrap,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { VideoStreamService } from './video-stream.service';

@Controller('video-stream')
export class VideoStreamController implements OnApplicationBootstrap {
  constructor(private videoStreamService: VideoStreamService) {}
  onApplicationBootstrap() {}

  @Get()
  getVideo(@Req() req: Request, @Res() res) {
    return this.videoStreamService.getVideo(res, req.headers.range);
  }
}
