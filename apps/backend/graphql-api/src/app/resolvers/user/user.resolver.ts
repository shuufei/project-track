import type {
  IListProjectsByUserIdService,
  IListUsersService,
} from '@bison/backend/application';
import {
  LIST_PROJECTS_BY_USER_ID_SERVICE,
  LIST_USERS_SERVICE,
} from '@bison/backend/application';
import type { User } from '@bison/shared/schema';
import { Inject } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IdpUserId } from '../../decorators/idp-user-id.decorator';
import { ParseUserPipe } from '../../pipes/parse-user/parse-user.pipe';
import { convertToApiColorFromDomainColor } from '../../util/convert-to-color-from-domain-color';
import type { ResolvedProject, ResolvedUser } from '../resolved-value-type';

@Resolver('User')
export class UserResolver {
  constructor(
    @Inject(LIST_PROJECTS_BY_USER_ID_SERVICE)
    private listProjectsByUserIdService: IListProjectsByUserIdService,
    @Inject(LIST_USERS_SERVICE) private listUsersService: IListUsersService
  ) {}

  @Query()
  async viewer(@IdpUserId(ParseUserPipe) user: User): Promise<ResolvedUser> {
    return user;
  }

  @Query()
  async users(): Promise<ResolvedUser[]> {
    const response = await this.listUsersService.handle();
    return response.users;
  }

  @ResolveField()
  async projects(@Parent() user: ResolvedUser): Promise<ResolvedProject[]> {
    const response = await this.listProjectsByUserIdService.handle(user.id);
    return response.projects.map((project) => {
      return {
        ...project,
        color: convertToApiColorFromDomainColor(project.color),
        admin: {
          id: project.adminUserId,
        },
      };
    });
  }
}
