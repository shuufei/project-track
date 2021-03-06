import {
  GetUserByIdpUserIdService,
  GET_USER_BY_IDP_USER_ID_SERVICE,
} from '@bison/backend/application';
import { USER_REPOSITORY } from '@bison/backend/domain';
import { UserRepository } from '@bison/backend/infrastructure/repository';
import { Module } from '@nestjs/common';
import { ParseUserPipe } from './parse-user.pipe';

const GetUserByIdpUserIdServiceProvider = {
  provide: GET_USER_BY_IDP_USER_ID_SERVICE,
  useClass: GetUserByIdpUserIdService,
};

const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

@Module({
  providers: [
    ParseUserPipe,
    GetUserByIdpUserIdServiceProvider,
    UserRepositoryProvider,
  ],
  exports: [GetUserByIdpUserIdServiceProvider],
})
export class ParseUserPipeModule {}
