import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { PreviewService } from './preview.service';

@Controller('api/preview')
@ApiTags('Preview')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class PreviewController {
  constructor(private previewService: PreviewService) {}

  @Get(':id')
  getFile(@Param('id') id: string, @Req() req: Request, @Res() res) {
    return this.previewService.getPreview(2, id, res);
  }
}
