import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { VideoStreamService } from './video-stream.service';
import { UploadVideoDto } from './dto/upload-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadVideoPreviewDto } from './dto/upload-video-preview.dto';

@Controller('api/video-stream')
@ApiTags('Video')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class VideoStreamController {
  constructor(private videoStreamService: VideoStreamService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 100 }),
          new FileTypeValidator({ fileType: 'video/*' }),
        ],
      }),
    )
    video: Express.Multer.File,
    @Req() req: Request,
    @Body() body: UploadVideoDto,
  ) {
    const user = req.user;

    if (!video) throw new BadRequestException('video is missing');

    return this.videoStreamService.uploadVideo(user.id, {
      ...body,
      video,
    });
  }

  @Post('upload/preview')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('preview'))
  uploadVideoPreview(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    preview: Express.Multer.File,
    @Body() body: UploadVideoPreviewDto,
  ) {
    console.log(body);
  }

  @Get('recent_videos')
  getRecentVideosWithPhotos(
    @Query('count', new DefaultValuePipe(0), new ParseIntPipe())
    count: number,
  ) {
    return this.videoStreamService.getRecentVideosWithPhotos(count);
  }

  // @Get(':id')
  // @UseGuards(PrivateVideoGuard)
  // getVideo(@Param('id') id: string, @Req() req: Request, @Res() res) {
  //   const video = req.video;

  //   return this.videoStreamService.getStream(
  //     res,
  //     video.userId,
  //     parseInt(id, 10),
  //     req.headers.range,
  //   );
  // }

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
