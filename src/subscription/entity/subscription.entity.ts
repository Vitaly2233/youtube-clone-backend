import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  subscribedOn: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  subscribedAt?: number;
}
