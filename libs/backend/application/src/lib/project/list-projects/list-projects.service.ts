import type { IProjectRepository } from '@bison/backend/domain';
import { PROJECT_REPOSITORY } from '@bison/backend/domain';
import { Inject } from '@nestjs/common';
import { IListProjectsService } from './list-projects.service.interface';

export class ListProjectsService implements IListProjectsService {
  constructor(
    @Inject(PROJECT_REPOSITORY) private repository: IProjectRepository
  ) {}

  async handle(): ReturnType<IListProjectsService['handle']> {
    return this.repository.list();
  }
}