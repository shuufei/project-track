import {
  GetBoardByIdService,
  GetProjectByBoardIdService,
  GetUserByIdService,
  GET_BOARD_BY_ID_SERVICE,
  GET_PROJECT_BY_BOARD_ID_SERVICE,
  GET_USER_BY_ID_SERVICE,
  ListTasksByTaskGroupIdService,
  LIST_TASKS_BY_TASK_GROUP_ID_SERVICE,
} from '@bison/backend/application';
import {
  BOARD_REPOSITORY,
  MockBoardRepository,
  MockProjectRepository,
  MockTaskRepository,
  MockUserRepository,
  PROJECT_REPOSITORY,
  TASK_REPOSITORY,
  USER_REPOSITORY,
} from '@bison/backend/domain';
import { Module } from '@nestjs/common';
import { TaskGroupResolver } from './task-group.resolver';

@Module({
  providers: [
    TaskGroupResolver,
    {
      provide: GET_BOARD_BY_ID_SERVICE,
      useClass: GetBoardByIdService,
    },
    {
      provide: BOARD_REPOSITORY,
      useClass: MockBoardRepository,
    },
    {
      provide: GET_PROJECT_BY_BOARD_ID_SERVICE,
      useClass: GetProjectByBoardIdService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: MockProjectRepository,
    },
    {
      provide: GET_USER_BY_ID_SERVICE,
      useClass: GetUserByIdService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MockUserRepository,
    },
    {
      provide: LIST_TASKS_BY_TASK_GROUP_ID_SERVICE,
      useClass: ListTasksByTaskGroupIdService,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: MockTaskRepository,
    },
  ],
})
export class TaskGroupModule {}