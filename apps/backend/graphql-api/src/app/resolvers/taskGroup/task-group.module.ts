import {
  CreateTaskGroupService,
  CREATE_TASK_GROUP_SERVICE,
  DeleteTaskGroupService,
  DELETE_TASK_GROUP_SERVICE,
  GetBoardByIdService,
  GetProjectByBoardIdService,
  GetTaskGroupByIdService,
  GetUserByIdService,
  GET_BOARD_BY_ID_SERVICE,
  GET_PROJECT_BY_BOARD_ID_SERVICE,
  GET_TASK_GROUP_BY_ID_SERVICE,
  GET_USER_BY_ID_SERVICE,
  ListTasksByTaskGroupIdService,
  LIST_TASKS_BY_TASK_GROUP_ID_SERVICE,
  UpdateTaskGroupService,
  UPDATE_TASK_GROUP_SERVICE,
} from '@bison/backend/application';
import {
  BOARD_REPOSITORY,
  CanAccessProjectService,
  CAN_ACCESS_PROJECT_SERVICE,
  PROJECT_REPOSITORY,
  TASK_GROUP_REPOSITORY,
  TASK_REPOSITORY,
  USER_REPOSITORY,
} from '@bison/backend/domain';
import {
  BoardRepository,
  ProjectRepository,
  TaskGroupRepository,
  TaskRepository,
  UserRepository,
} from '@bison/backend/infrastructure/repository';
import { Module } from '@nestjs/common';
import { ParseUserPipeModule } from '../../pipes/parse-user/parse-user.module';
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
      useClass: BoardRepository,
    },
    {
      provide: GET_PROJECT_BY_BOARD_ID_SERVICE,
      useClass: GetProjectByBoardIdService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: GET_USER_BY_ID_SERVICE,
      useClass: GetUserByIdService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: LIST_TASKS_BY_TASK_GROUP_ID_SERVICE,
      useClass: ListTasksByTaskGroupIdService,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: TASK_GROUP_REPOSITORY,
      useClass: TaskGroupRepository,
    },
    {
      provide: CREATE_TASK_GROUP_SERVICE,
      useClass: CreateTaskGroupService,
    },
    {
      provide: UPDATE_TASK_GROUP_SERVICE,
      useClass: UpdateTaskGroupService,
    },
    {
      provide: DELETE_TASK_GROUP_SERVICE,
      useClass: DeleteTaskGroupService,
    },
    {
      provide: CAN_ACCESS_PROJECT_SERVICE,
      useClass: CanAccessProjectService,
    },
    {
      provide: GET_TASK_GROUP_BY_ID_SERVICE,
      useClass: GetTaskGroupByIdService,
    },
  ],
  imports: [ParseUserPipeModule],
})
export class TaskGroupModule {}
