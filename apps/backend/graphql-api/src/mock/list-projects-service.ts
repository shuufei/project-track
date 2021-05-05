import {
  IListProjectsService,
  ListProjectsResponse,
} from '@bison/backend/application';
import { Color } from '@bison/shared/domain';

export const mockListProjectsResponse: ListProjectsResponse = {
  projects: [
    {
      id: `project0001`,
      name: `project name 0001`,
      description: `project description 0001`,
      color: 'red' as Color,
    },
    {
      id: `project0002`,
      name: `project name 0002`,
      description: `project description 0002`,
      color: 'blue' as Color,
    },
    {
      id: `project0003`,
      name: `project name 0003`,
      description: `project description 0003`,
      color: 'green' as Color,
    },
  ],
};

export class MockListProjectsService implements IListProjectsService {
  async handle() {
    return mockListProjectsResponse;
  }
}