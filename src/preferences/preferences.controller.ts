import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../common/guard/jwt.guard';
import { DislikeService } from './dislike.service';
import { GetAllLikedVideosQueryDto } from './dto/get-all-liked-videos.query.dto';
import { LikeService } from './like.service';

@Controller('preferences')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Preferences')
export class PreferencesController {
  constructor(
    private readonly likesService: LikeService,
    private readonly dislikeService: DislikeService,
  ) {}

  @Post('video/:videoId/like')
  toggleLike(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Req() req: Request,
  ) {
    return this.likesService.toggleLike(videoId, req.user);
  }

  @Post('video/:videoId/dislike')
  toggleDislike(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Req() req: Request,
  ) {
    return this.dislikeService.toggleDislike(videoId, req.user);
  }

  @Get('all_liked_videos')
  getAllLikedVideos(
    @Req() req: Request,
    @Query() query: GetAllLikedVideosQueryDto,
  ) {
    return this.likesService.getAllLikedVideos(req.user, query);
  }
}
