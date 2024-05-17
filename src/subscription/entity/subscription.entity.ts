import { IsNotEmpty } from 'class-validator';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from '../../common/validators/is-number';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscribers, {
    onDelete: 'CASCADE',
  })
  subscriber: User | number;

  @IsNumber()
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: 'CASCADE',
  })
  subscribedTo: User | number;
}
