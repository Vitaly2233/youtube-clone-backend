import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequestDto } from 'src/auth/dto/register-request.dto';
import { Repository } from 'typeorm';
import { EntityService } from '../common/abstract/entity-service.abstract';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService
  extends EntityService<User>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async onApplicationBootstrap() {
    await this.userRepository.delete({ id: 1 });
  }

  async findOneByUsername(username: string, showPassword?: boolean) {
    if (showPassword)
      return this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ username })
        .getOne();

    return this.userRepository.findOne({ where: { username } });
  }

  async create({ username, password }: RegisterRequestDto) {
    const newUser = this.userRepository.create({
      password,
      username,
    });
    return this.userRepository.save(newUser);
  }

  async getAll() {
    return this.userRepository.find();
  }

  async updateUser(user: User, dto: UpdateUserDto) {
    return this.userRepository.save({ id: user.id, ...dto });
  }

  async deleteUser(userId: number) {
    return this.userRepository.delete({ id: userId });
  }
}
