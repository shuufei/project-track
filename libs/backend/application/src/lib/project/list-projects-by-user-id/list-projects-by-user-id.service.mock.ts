import { COLOR } from '@bison/shared/domain';
import { MockReturnValues } from '@bison/types/testing';
import { IListProjectsByUserIdService } from './list-projects-by-user-id.service.interface';

export const mockListProjectsByUserIdServiceReturnValues: MockReturnValues<IListProjectsByUserIdService> = {
  handle: {
    projects: [
      {
        id: `project001`,
        name: `project name 001`,
        description: `project description 001`,
        color: COLOR.Red,
        adminUserId: 'admin user 0001',
      },
      {
        id: `project002`,
        name: `project name 002`,
        description: `project description 002`,
        color: COLOR.Blue,
        adminUserId: 'admin user 0002',
      },
      {
        id: `project003`,
        name: `project name 003`,
        description: `project description 003`,
        color: COLOR.Green,
        adminUserId: 'admin user 0003',
      },
    ],
  },
};

export class MockListProjectsByUserIdService
  implements IListProjectsByUserIdService {
  async handle() {
    return mockListProjectsByUserIdServiceReturnValues.handle;
  }
}
