import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../common/guard/jwt.guard';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe/user/:subscribeTo')
  subscribe(
    @Param('subscribeTo', ParseIntPipe) subscribeTo: number,
    @Req() req: Request,
  ) {
    return this.subscriptionService.subscribe(subscribeTo, req.user);
  }

  @Post('unsubscribe/user/:unsubscribeFrom')
  unsubscribe(
    @Param('unsubscribeFrom', ParseIntPipe) unsubscribeFrom: number,
    @Req() req: Request,
  ) {
    return this.subscriptionService.unsubscribe(unsubscribeFrom, req.user);
  }

  @Get()
  getUserSubscriptions(@Req() req: Request) {
    return this.subscriptionService.getUserSubscriptions(req.user);
  }
}
