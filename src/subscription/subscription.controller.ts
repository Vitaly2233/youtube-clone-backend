import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@ApiTags('Subscription')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getUserSubscriptions(@Req() req: Request) {
    return this.subscriptionService.getUserSubscriptions(req.user.id);
  }

  @Post()
  create(@Req() req: Request, @Body() body: CreateSubscriptionDto) {
    const { subscribedOn } = body;

    return this.subscriptionService.create({
      userId: req.user.id,
      subscribedOn,
    });
  }

  @Delete(':id')
  delete(@Req() req: Request, @Param('id') id: number) {
    return this.subscriptionService.delete(id, req.user.id);
  }
}
