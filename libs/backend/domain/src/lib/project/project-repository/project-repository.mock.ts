import { COLOR } from '@bison/shared/domain';
import { MockReturnValues } from '@bison/types/testing';
import {
  IProjectRepository,
  ListProjectsResponse,
} from './project-repository.interface';

const mockListProjectsResponse: ListProjectsResponse = {
  projects: [
    {
      id: `project0001`,
      name: `project name 0001`,
      description: `project description 0001`,
      color: COLOR.Red,
      adminUserId: 'admin user 0001',
    },
    {
      id: `project0002`,
      name: `project name 0002`,
      description: `project description 0002`,
      color: COLOR.Blue,
      adminUserId: 'admin user 0001',
    },
    {
      id: `project0003`,
      name: `project name 0003`,
      description: `project description 0003`,
      color: COLOR.Green,
      adminUserId: 'admin user 0002',
    },
  ],
};

export const mockProjectRepositoryReturnValues: MockReturnValues<IProjectRepository> = {
  getById: {
    id: `project0001`,
    name: `project name 0001`,
    description: `project description 0001`,
    color: COLOR.Red,
    adminUserId: 'user0001',
  },
  listByUserId: mockListProjectsResponse,
  create: {
    id: `project0001`,
    name: `project name 0001`,
    description: `project description 0001`,
    color: COLOR.Red,
    adminUserId: 'admin user 0001',
  },
  update: {
    id: `project0001`,
    name: `project name 0001`,
    description: `project description 0001`,
    color: COLOR.Red,
    adminUserId: 'admin user 0001',
  },
  delete: undefined,
  addMembers: undefined,
  removeMembers: undefined,
};

export class MockProjectRepository implements IProjectRepository {
  async getById() {
    return mockProjectRepositoryReturnValues.getById;
  }

  async listByUserId() {
    return mockProjectRepositoryReturnValues.listByUserId;
  }

  async create() {
    return mockProjectRepositoryReturnValues.create;
  }

  async update() {
    return mockProjectRepositoryReturnValues.update;
  }

  async delete() {
    return mockProjectRepositoryReturnValues.delete;
  }

  async addMembers() {
    return;
  }

  async removeMembers() {
    return;
  }
}
