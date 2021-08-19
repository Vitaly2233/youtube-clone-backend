import {
  Body,
  Controller,
  Delete,
  Get,
  OnApplicationBootstrap,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { VideoService } from './video.service';
import { PrivateVideoGuard } from './guards/private-video.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('api/video-stream')
@UseGuards(JwtGuard, PrivateVideoGuard)
export class VideoController implements OnApplicationBootstrap {
  constructor(private VideoService: VideoService) {}
  onApplicationBootstrap() {}

  @Get(':id')
  getVideo(@Param('id') id: string, @Req() req: Request, @Res() res) {
    const video = req.video;

    return this.VideoService.getStream(
      res,
      video.userId,
      parseInt(id, 10),
      req.headers.range,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('isPrivate', ParseBoolPipe) isPrivate: boolean,
    @Req() req: Request,
    @Body() body: CreateVideoDto,
  ) {
    const user = req.user;

    return await this.VideoService.upload(file.buffer, user.id, isPrivate, {
      ...body,
    });
  }

  @Delete(':id')
  async deleteVideo(@Param('id') id: string, @Req() req: Request) {
    return await this.VideoService.delete(parseInt(id, 10), req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateVideoDto) {
    return await this.VideoService.update(parseInt(id, 10), { ...body });
  }
}
