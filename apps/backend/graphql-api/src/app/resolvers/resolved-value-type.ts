import {
  Board,
  Project,
  Subtask,
  Task,
  TaskGroup,
  User,
} from '@bison/shared/schema';

export type ResolvedBoard = Pick<
  Board,
  'id' | 'name' | 'description' | 'tasksOrder' | 'createdAt'
> & {
  project: Pick<Board['project'], 'id'>;
};

export type ResolvedTaskGroup = Pick<
  TaskGroup,
  | 'id'
  | 'title'
  | 'description'
  | 'status'
  | 'scheduledTimeSec'
  | 'tasksOrder'
  | 'createdAt'
> & {
  assign?: Pick<User, 'id'>;
  board: Pick<TaskGroup['board'], 'id'>;
};

export type ResolvedUser = Pick<User, 'id' | 'name' | 'icon'>;

export type ResolvedProject = Pick<
  Project,
  'id' | 'name' | 'description' | 'color'
> & {
  admin: Pick<Project['admin'], 'id'>;
};

export type ResolvedTask = Pick<
  Task,
  | 'id'
  | 'title'
  | 'description'
  | 'status'
  | 'workTimeSec'
  | 'scheduledTimeSec'
  | 'subtasksOrder'
  | 'workStartDateTimestamp'
  | 'createdAt'
> & {
  assign?: Pick<User, 'id'>;
  board: Pick<Task['board'], 'id'>;
  taskGroup?: Pick<TaskGroup, 'id'>;
};

export type ResolvedSubtask = Pick<
  Subtask,
  | 'id'
  | 'title'
  | 'description'
  | 'isDone'
  | 'workTimeSec'
  | 'scheduledTimeSec'
  | 'workStartDateTimestamp'
  | 'createdAt'
> & {
  assign?: Pick<User, 'id'>;
  task: Pick<Subtask['task'], 'id'>;
};
