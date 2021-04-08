import {
  GET_BACKLOG_BY_PROJECT_ID_SERVICE,
  IGetBacklogByProjectIdService,
  IListBoardsByProjectIdService,
  ListBoardsResponse,
  ListProjectsService,
  LIST_PROJECTS_SERVICE,
} from '@bison/backend/application';
import {
  IProjectRepository,
  ListResponse,
  PROJECT_REPOSITORY,
} from '@bison/backend/domain';
import type { Color } from '@bison/shared/domain';
import { Module } from '@nestjs/common';
import { LIST_BOARDS_BY_PROJECT_ID_SERVICE } from '../../../../../../libs/backend/application/src/lib/board/interface/list-boards-by-project-id-service';
import { ProjectResolver } from './project.resolver';

const getRandom = () => Math.floor(Math.random() * 1000);

class MockProjectRepository implements IProjectRepository {
  async list(): Promise<ListResponse> {
    return {
      edges: [
        {
          cursor: '',
          node: {
            id: `project${getRandom()}`,
            name: `project name ${getRandom()}`,
            description: `project description ${getRandom()}`,
            color: 'red' as Color,
          },
        },
        {
          cursor: '',
          node: {
            id: `project${getRandom()}`,
            name: `project name ${getRandom()}`,
            description: `project description ${getRandom()}`,
            color: 'blue' as Color,
          },
        },
        {
          cursor: '',
          node: {
            id: `project${getRandom()}`,
            name: `project name ${getRandom()}`,
            description: `project description ${getRandom()}`,
            color: 'green' as Color,
          },
        },
      ],
    };
  }
}

class MockGetBacklogByProjectIdService
  implements IGetBacklogByProjectIdService {
  handle() {
    return Promise.resolve({
      id: `mock backlog id ${getRandom()}`,
    });
  }
}

class MockListBoardsByProjectIdService
  implements IListBoardsByProjectIdService {
  handle(): ListBoardsResponse {
    return Promise.resolve({
      edges: [
        {
          cursor: '',
          node: {
            id: `board${getRandom()}`,
            name: `board name ${getRandom()}`,
            description: `board description ${getRandom()}`,
            isArchived: false,
          },
        },
        {
          cursor: '',
          node: {
            id: `board${getRandom()}`,
            name: `board name ${getRandom()}`,
            description: `board description ${getRandom()}`,
            isArchived: false,
          },
        },
        {
          cursor: '',
          node: {
            id: `board${getRandom()}`,
            name: `board name ${getRandom()}`,
            description: `board description ${getRandom()}`,
            isArchived: false,
          },
        },
      ],
      hasNextPage: false,
    });
  }
}

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
  ],
})
export class ProjectModule {}
