import {
  CreateBoardService,
  CREATE_BOARD_SERVICE,
  DeleteBoardService,
  DELETE_BOARD_SERVICE,
  GetBoardByIdAndUserService,
  GetProjectByBoardIdService,
  GET_BOARD_BY_ID_AND_USER_SERVICE,
  GET_PROJECT_BY_BOARD_ID_SERVICE,
  ListSoloTasksByBoardIdService,
  ListTaskGroupsByBoardIdService,
  LIST_SOLO_TASKS_BY_BOARD_ID_SERVICE,
  LIST_TASK_GROUPS_BY_BOARD_ID_SERVICE,
  UpdateBoardService,
  UPDATE_BOARD_SERVICE,
} from '@bison/backend/application';
import {
  BOARD_REPOSITORY,
  CanAccessProjectService,
  CAN_ACCESS_PROJECT_SERVICE,
  PROJECT_REPOSITORY,
  TASK_GROUP_REPOSITORY,
  TASK_REPOSITORY,
} from '@bison/backend/domain';
import {
  BoardRepository,
  ProjectRepository,
  TaskGroupRepository,
  TaskRepository,
} from '@bison/backend/infrastructure/repository';
import { Module } from '@nestjs/common';
import { ParseUserPipeModule } from '../../pipes/parse-user/parse-user.module';
import { BoardResolver } from './board.resolver';

@Module({
  providers: [
    BoardResolver,
    {
      provide: GET_PROJECT_BY_BOARD_ID_SERVICE,
      useClass: GetProjectByBoardIdService,
    },
    {
      provide: LIST_TASK_GROUPS_BY_BOARD_ID_SERVICE,
      useClass: ListTaskGroupsByBoardIdService,
    },
    {
      provide: GET_BOARD_BY_ID_AND_USER_SERVICE,
      useClass: GetBoardByIdAndUserService,
    },
    {
      provide: CAN_ACCESS_PROJECT_SERVICE,
      useClass: CanAccessProjectService,
    },
    {
      provide: LIST_SOLO_TASKS_BY_BOARD_ID_SERVICE,
      useClass: ListSoloTasksByBoardIdService,
    },
    {
      provide: TASK_GROUP_REPOSITORY,
      useClass: TaskGroupRepository,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: BOARD_REPOSITORY,
      useClass: BoardRepository,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: CREATE_BOARD_SERVICE,
      useClass: CreateBoardService,
    },
    {
      provide: UPDATE_BOARD_SERVICE,
      useClass: UpdateBoardService,
    },
    {
      provide: DELETE_BOARD_SERVICE,
      useClass: DeleteBoardService,
    },
  ],
  imports: [ParseUserPipeModule],
})
export class BoardModule {}
