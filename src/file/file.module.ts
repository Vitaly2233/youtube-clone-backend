import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Video } from './entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PreviewService } from './preview.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), UserModule],
  providers: [VideoService, PreviewService],
  controllers: [VideoController],
})
export class FileModule {}
