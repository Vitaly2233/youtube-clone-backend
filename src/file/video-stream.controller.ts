import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  OnApplicationBootstrap,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { VideoStreamService } from './video-stream.service';
import { PrivateVideoGuard } from './guards/private-video.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UploadFilesTypes } from './type/upload.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/video-stream')
@ApiTags('Video')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class VideoStreamController implements OnApplicationBootstrap {
  constructor(private videoStreamService: VideoStreamService) {}
  onApplicationBootstrap() {}

  @Get('recent_videos')
  getRecentVideosWithPhotos(
    @Query('count', new DefaultValuePipe(0), new ParseIntPipe())
    count: number,
  ) {
    return this.videoStreamService.getRecentVideosWithPhotos(count);
  }

  @Get(':id')
  @UseGuards(PrivateVideoGuard)
  getVideo(@Param('id') id: string, @Req() req: Request, @Res() res) {
    const video = req.video;

    return this.videoStreamService.getStream(
      res,
      video.userId,
      parseInt(id, 10),
      req.headers.range,
    );
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'preview', maxCount: 1 },
    ]),
  )
  async upload(
    @UploadedFiles() files: UploadFilesTypes,
    @Query('isPrivate', new ParseBoolPipe()) isPrivate: boolean,
    @Req() req: Request,
    @Body() body: CreateVideoDto,
  ) {
    const user = req.user;
    if (!files?.video) throw new BadRequestException('video was not provided');

    return this.videoStreamService.upload(files, user.id, isPrivate, {
      ...body,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateVideoDto,
  ) {
    return this.videoStreamService.update(id, { ...body });
  }

  @Delete(':id')
  async deleteVideo(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    return this.videoStreamService.delete(id, req.user.id);
  }
}
