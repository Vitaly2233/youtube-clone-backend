import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Headers,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { UploadVideoDto } from './dto/upload-video.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadPreviewDto } from './dto/upload-preview.dto';
import { Public } from '../common/decorator/public.decorator';
import { VideoService } from './services/video.service';
import { PreviewService } from './services/preview.service';

@Controller('video-stream')
@ApiTags('Video')
@UseGuards(JwtGuard)
export class VideoStreamController {
  constructor(
    private videoStreamService: VideoService,
    private readonly previewService: PreviewService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
    @Body() body: UploadPreviewDto,
  ) {
    if (!preview) throw new BadRequestException('preview is missing');

    return this.previewService.uploadPreview({ ...body, preview });
  }

  @Get()
  @ApiBearerAuth()
  getUserVideos(@Req() req: Request) {
    return this.videoStreamService.getUserVideos(req.user);
  }

  @Get(':fileName')
  @Public()
  downloadVideo(
    @Param('fileName') fileName: string,
    @Headers() headers,
    @Res() response: Response,
  ) {
    return this.videoStreamService.streamVideo(fileName, headers, response);
  }

  @Get('preview/:fileName')
  @Public()
  @Header('Content-Type', 'image/*')
  @ApiProduces('image/*')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  downloadPreview(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const file = this.previewService.getPreviewFile(fileName);
    file.pipe(response);
  }

  @Delete(':id')
  @ApiBearerAuth()
  deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videoStreamService.deleteVideo(id);
  }

  @Delete('preview/:id')
  @ApiBearerAuth()
  deletePreview(@Param('id', ParseIntPipe) id: number) {
    return this.previewService.deletePreview(id);
  }
}
