import { MockReturnValues } from '@bison/types/testing';
import { IGetUserByIdpUserIdService } from './get-user-by-idp-user-id.service.interface';

export const mockGetUserByIdpUserIdServiceReturnValues: MockReturnValues<IGetUserByIdpUserIdService> = {
  handle: {
    id: 'user0001',
    name: 'user name 0001',
    icon: 'user icon 0001',
  },
};

export class MockGetUserByIdpUserIdService
  implements IGetUserByIdpUserIdService {
  async handle() {
    return mockGetUserByIdpUserIdServiceReturnValues.handle;
  }
}
