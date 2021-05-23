import { BoardTaskType as DomainBoardTaskType } from '@bison/shared/domain';
import { BoardTaskType } from '@bison/shared/schema';

export const convertToApiBoardTaskTypeFromDomainBoardTaskType = (
  type: DomainBoardTaskType
): BoardTaskType => {
  switch (type) {
    case 'TaskGroup':
      return BoardTaskType.TASKGROUP;
    case 'Task':
      return BoardTaskType.TASK;
  }
};
