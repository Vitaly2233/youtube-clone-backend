import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Subscription } from './entity/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async subscribe(subscribeTo: number, user: User) {
    if (subscribeTo === user.id) {
      throw new ConflictException('you cannot subscribe to yourself');
    }

    const duplication = await this.findDuplication(subscribeTo, user.id);
    if (duplication) {
      throw new ConflictException("you're already subscribed");
    }

    return this.subscriptionRepository.save({
      subscribedTo: subscribeTo,
      subscriber: user.id,
    });
  }

  unsubscribe(unsubscribeFrom: number, user: User) {
    return this.subscriptionRepository.delete({
      subscribedTo: unsubscribeFrom,
      subscriber: user.id,
    });
  }

  async getUserSubscriptions(user: User) {
    return this.subscriptionRepository.find({
      where: { subscriber: user.id },
      relations: ['subscribedTo'],
    });
  }

  private findDuplication(subscribedTo: number, subscriber: number) {
    return this.subscriptionRepository.findOne({
      where: { subscribedTo, subscriber },
    });
  }
}
