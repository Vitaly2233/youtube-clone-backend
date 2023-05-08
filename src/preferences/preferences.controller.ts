import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../common/guard/jwt.guard';
import { DislikeService } from './dislike.service';
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
}
