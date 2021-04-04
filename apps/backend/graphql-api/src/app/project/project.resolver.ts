import type {
  IListProjectsUsecase,
  ListProjectsResponse,
} from '@bison/backend/usecase';
import { LIST_PROJECTS_USECASE } from '@bison/backend/usecase';
import type { Color as DomainColor } from '@bison/shared/domain';
import { Inject } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { last } from 'lodash/fp';
import { OmitConnectionNode } from '../../helper-types';
import type { Project, ProjectConnection } from '../../schema-types';
import { Color } from '../../schema-types';

export const convertToApiColorFromDomainColor = (color: DomainColor): Color => {
  switch (color) {
    case 'blue':
      return Color.BLUE;
    case 'green':
      return Color.GREEN;
    case 'red':
      return Color.RED;
    case 'yellow':
      return Color.YELLOW;
    case 'brown':
      return Color.BROWN;
    case 'pink':
      return Color.PINK;
    case 'gray':
      return Color.GRAY;
  }
};

@Resolver('Project')
export class ProjectResolver {
  constructor(
    @Inject(LIST_PROJECTS_USECASE)
    private listProjectsUsecase: IListProjectsUsecase
  ) {}

  @Query()
  async projects(
    @Args('first', { type: () => Int }) first: number,
    @Args('after', { type: () => ID }) after?: Project['id']
  ): Promise<
    OmitConnectionNode<ProjectConnection, 'backlog' | 'boards' | 'users'>
  > {
    const response = await this.listProjectsUsecase.execute(first, after);
    const edges: OmitConnectionNode<
      ProjectConnection,
      'backlog' | 'boards' | 'users'
    >['edges'] = response.projects.map((project, i, self) => ({
      cursor: i !== 0 ? self[i - 1].id : after,
      node: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: convertToApiColorFromDomainColor(project.color),
      },
    }));
    return {
      pageInfo: {
        endCursor: last<ListProjectsResponse['projects'][number]>(
          response.projects
        )?.id,
        hasNextPage: response.nextEntityId !== undefined,
      },
      edges,
    };
  }

  @ResolveField()
  async backlog(@Parent() project: Project) {
    return {
      id: 'sample_backlog_001',
    };
  }
}
