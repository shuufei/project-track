import {
  GET_ADMIN_SERVICE,
  GET_BACKLOG_BY_PROJECT_ID_SERVICE,
  ListProjectsService,
  LIST_BOARDS_BY_PROJECT_ID_SERVICE,
  LIST_MEMBERS_SERVICE,
  LIST_PROJECTS_SERVICE,
} from '@bison/backend/application';
import { PROJECT_REPOSITORY } from '@bison/backend/domain';
import { Module } from '@nestjs/common';
import {
  MockGetAdminService,
  MockGetBacklogByProjectIdService,
  MockListBoardsByProjectIdService,
  MockListMembersService,
  MockProjectRepository,
} from '../../mock';
import { ProjectResolver } from './project.resolver';

@Module({
  providers: [
    ProjectResolver,
    {
      provide: LIST_PROJECTS_SERVICE,
      useClass: ListProjectsService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useValue: new MockProjectRepository(),
    },
    {
      provide: GET_BACKLOG_BY_PROJECT_ID_SERVICE,
      useValue: new MockGetBacklogByProjectIdService(),
    },
    {
      provide: LIST_BOARDS_BY_PROJECT_ID_SERVICE,
      useValue: new MockListBoardsByProjectIdService(),
    },
    {
      provide: LIST_MEMBERS_SERVICE,
      useValue: new MockListMembersService(),
    },
    {
      provide: GET_ADMIN_SERVICE,
      useValue: new MockGetAdminService(),
    },
  ],
})
export class ProjectModule {}