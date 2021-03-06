import type { IUserRepository } from '@bison/backend/domain';
import { USER_REPOSITORY } from '@bison/backend/domain';
import { Inject } from '@nestjs/common';
import type { IListUsersService } from './list-users.service.interface';

export class ListUsersService implements IListUsersService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository
  ) {}

  async handle(): ReturnType<IListUsersService['handle']> {
    return this.userRepository.list();
  }
}
