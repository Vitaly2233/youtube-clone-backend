import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

export abstract class EntityService<Entity> {
  constructor(private readonly _repository: Repository<Entity>) {}

  saveEntity(data: DeepPartial<Entity>) {
    return this._repository.save(data);
  }

  find(options: FindManyOptions<Entity>) {
    return this._repository.find(options);
  }

  findOne(options: FindOneOptions<Entity>) {
    return this._repository.findOne(options);
  }
}
