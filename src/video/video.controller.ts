import {
  Body,
  Controller,
  Delete,
  Get,
  OnApplicationBootstrap,
  Param,
  Patch,
  Post,
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
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('api/video-stream')
@UseGuards(JwtGuard)
export class VideoController implements OnApplicationBootstrap {
  constructor(private VideoService: VideoService) {}
  onApplicationBootstrap() {}

  @Get(':id')
  getVideo(@Param('id') id: string, @Req() req: Request, @Res() res) {
    return this.VideoService.getStream(
      res,
      req.user.id,
      parseInt(id, 10),
      req.headers.range,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: CreateFileDto,
  ) {
    const user = req.user;
    const { name, description } = body;
    return await this.VideoService.upload(
      user.id,
      name,
      description,
      file.buffer,
    );
  }

  @Delete(':id')
  async deleteVideo(@Param('id') id: string, @Req() req: Request) {
    return await this.VideoService.delete(parseInt(id, 10), req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateFileDto) {
    const { description, name } = body;
    return await this.VideoService.update(parseInt(id, 10), name, description);
  }
}
