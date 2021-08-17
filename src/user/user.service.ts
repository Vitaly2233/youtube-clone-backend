import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequestDto } from 'src/auth/dto/register-request.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create({ username, password }: RegisterRequestDto) {
    const newUser = this.userRepository.create({
      password,
      username,
    });
    return await this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
  async findById(id: number) {
    return this.userRepository.findOne(id);
  }

  async updateOneBy(userUpdate: User) {
    await this.userRepository.save({ ...userUpdate });
  }

  async updateByIds(ids: number[], updateData: User) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...updateData })
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
