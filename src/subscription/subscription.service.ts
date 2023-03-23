import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entity/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(dto: Subscription) {
    const { userId, subscribedOn } = dto;
    await this.validateUserSubscription(userId, subscribedOn);

    const newSubscription = this.subscriptionRepository.create({ ...dto });
    return this.subscriptionRepository.save(newSubscription);
  }

  async getUserSubscriptions(userId: number) {
    return this.subscriptionRepository
      .createQueryBuilder('sub')
      .where('sub.userId = :id', { id: userId })
      .getMany();
  }

  async delete(id: number, userId: number) {
    await this.validateUnsubscription(id, userId);
    return this.subscriptionRepository.delete({ id });
  }

  private async validateUserSubscription(userId: number, subscribedOn: number) {
    const count = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .where('sub.userId = :userId', { userId: userId })
      .andWhere('sub.subscribedOn = :subId', { subId: subscribedOn })
      .getCount();

    if (count !== 0) throw new ForbiddenException(`you're already subscribed`);
    return true;
  }

  private async validateUnsubscription(id: number, userId: number) {
    const subscription = await this.subscriptionRepository.findOne(id);
    if (subscription.userId !== userId)
      throw new ForbiddenException(`you can delete only your subscriptions`);
  }
}
