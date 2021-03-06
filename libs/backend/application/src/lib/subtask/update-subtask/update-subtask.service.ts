import type {
  IBoardRepository,
  ICanAccessProjectService,
  ISubtaskRepository,
  ITaskRepository,
} from '@bison/backend/domain';
import {
  BOARD_REPOSITORY,
  CAN_ACCESS_PROJECT_SERVICE,
  SUBTASK_REPOSITORY,
  TASK_REPOSITORY,
} from '@bison/backend/domain';
import { Inject } from '@nestjs/common';
import { PermissionDeniedError } from '../../errors';
import type { IUpdateSubtaskService } from './update-subtask.service.interface';

export class UpdateSubtaskService implements IUpdateSubtaskService {
  constructor(
    @Inject(SUBTASK_REPOSITORY)
    private readonly subtaskRepository: ISubtaskRepository,
    @Inject(CAN_ACCESS_PROJECT_SERVICE)
    private readonly canAccessProjectService: ICanAccessProjectService,
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
    @Inject(BOARD_REPOSITORY) private readonly boardRepository: IBoardRepository
  ) {}

  async handle(
    ...args: Parameters<IUpdateSubtaskService['handle']>
  ): ReturnType<IUpdateSubtaskService['handle']> {
    const [subtask, user] = args;
    const task = await this.taskRepository.getById(subtask.taskId);
    const board = await this.boardRepository.getById(task.boardId);
    const canAccessProject = await this.canAccessProjectService.handle(
      user.id,
      board.projectId
    );
    if (!canAccessProject) {
      throw new PermissionDeniedError();
    }
    const updatedSubtask = await this.subtaskRepository.update(subtask);
    return updatedSubtask;
  }
}
