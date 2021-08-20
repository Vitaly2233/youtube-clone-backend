import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PreviewModule } from 'src/preview/preview.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), UserModule, PreviewModule],
  providers: [VideoService],
  controllers: [VideoController],
})
export class FileModule {}
