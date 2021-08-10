import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  APOLLO_DATA_QUERY,
  CREATE_SUBTASK_USECASE,
  DELETE_TASK_USECASE,
  IApolloDataQuery,
  ICreateSubtaskUsecase,
  IDeleteTaskUsecase,
  IUpdateTaskUsecase,
  UPDATE_TASK_USECASE,
} from '@bison/frontend/application';
import { Task } from '@bison/frontend/domain';
import { Board, User } from '@bison/frontend/ui';
import {
  CreateSubtaskInput,
  DeleteTaskInput,
  UpdateTaskInput,
} from '@bison/shared/schema';
import { RxState } from '@rx-angular/state';
import { TuiNotificationsService } from '@taiga-ui/core';
import { gql } from 'apollo-angular';
import { of, Subject } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { convertToApiStatusFromDomainStatus } from '../../../../util/convert-to-api-status-from-domain-status';
import { convertToDomainSubtaskFromApiSubtask } from '../../../../util/convert-to-domain-subtask-from-api-subtask';
import { convertToDomainTaskGroupFromApiTaskGroup } from '../../../../util/convert-to-domain-task-group-from-api-task-group';
import { TaskDialogService } from '../task-dialog.service';

const USER_FIELDS = gql`
  fragment UserPartsInTaskDialog on User {
    id
    name
    icon
  }
`;

const SUBTASK_FIELDS = gql`
  fragment SubtaskPartsInTaskDialog on Subtask {
    id
    title
    description
    isDone
    task {
      id
    }
    scheduledTimeSec
    workTimeSec
    assign {
      id
      name
      icon
    }
  }
`;

const TASKGROUP_FIELDS = gql`
  fragment TaskGroupPartsInTaskDialog on TaskGroup {
    id
    title
    description
    status
    scheduledTimeSec
    tasksOrder
    assign {
      id
      name
      icon
    }
    board {
      id
      name
      project {
        id
      }
    }
  }
`;

const PROJECT_FIELDS = gql`
  fragment ProjectPartsInTaskDialog on Project {
    id
    boards {
      id
      name
    }
  }
`;

type State = {
  task?: Task;
  isEditableTitleAndDesc: boolean;
  editState?: {
    title: Task['title'];
    description: Task['description'];
  };
  users: User[];
  boards: Board[];
};

@Component({
  selector: 'bis-task-dialog-task-content',
  templateUrl: './task-dialog-task-content.component.html',
  styleUrls: ['./task-dialog-task-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class TaskDialogTaskContentComponent implements OnInit {
  @Input()
  set task(value: Task) {
    this.state.set('task', () => value);
  }

  /**
   * State
   */
  readonly state$ = this.state.select();

  /**
   * Event
   */
  readonly onClickedCloseButton$ = new Subject<void>();
  readonly onClickedEditTitleAndDescButton$ = new Subject<void>();
  readonly onClickedEditTitleAndDescCancelButton$ = new Subject<void>();
  readonly onClickedUpdateTitleAndDescButton$ = new Subject<void>();
  readonly onChangedTitle$ = new Subject<Task['title']>();
  readonly onChangedDescription$ = new Subject<Task['description']>();
  readonly onChangedAssignUser$ = new Subject<User['id'] | undefined>();
  readonly onChangedStatus$ = new Subject<Task['status']>();
  readonly onChangedBoard$ = new Subject<Board['id']>();
  readonly onDrop$ = new Subject<CdkDragDrop<Task['subtasks']>>();
  readonly onClickedTaskGroup$ = new Subject<void>();
  readonly onClickedSubtask$ = new Subject<Task['subtasks'][number]>();
  readonly onClickedPlay$ = new Subject<void>();
  readonly onClickedPause$ = new Subject<void>();
  readonly onChangedWorkTimeSec$ = new Subject<number>();
  readonly onChangedScheduledTimeSec$ = new Subject<number>();
  readonly onDelete$ = new Subject<void>();
  readonly onClickedAddSubtask$ = new Subject<void>();

  constructor(
    private state: RxState<State>,
    private taskDialogService: TaskDialogService,
    @Inject(APOLLO_DATA_QUERY) private apolloDataQuery: IApolloDataQuery,
    @Inject(UPDATE_TASK_USECASE) private updateTaskUsecase: IUpdateTaskUsecase,
    @Inject(DELETE_TASK_USECASE) private deleteTaskUsecase: IDeleteTaskUsecase,
    @Inject(CREATE_SUBTASK_USECASE)
    private createSubtaskUsecase: ICreateSubtaskUsecase,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    this.state.set({
      isEditableTitleAndDesc: false,
      users: [],
      boards: [],
    });
  }

  ngOnInit(): void {
    /**
     * TODO:
     * - サブタスク追加
     */
    this.state.connect(this.onClickedEditTitleAndDescButton$, (state) => {
      return {
        ...state,
        isEditableTitleAndDesc: true,
        editState: {
          title: state.task?.title ?? '',
          description: state.task?.description,
        },
      };
    });
    this.state.connect(this.onClickedEditTitleAndDescCancelButton$, (state) => {
      return { ...state, isEditableTitleAndDesc: false };
    });
    this.state.connect(
      'isEditableTitleAndDesc',
      this.onClickedUpdateTitleAndDescButton$,
      () => {
        return false;
      }
    );
    this.state.connect('editState', this.onChangedTitle$, (state, title) => {
      return { title, description: state.editState?.description };
    });
    this.state.connect(
      'editState',
      this.onChangedDescription$,
      (state, description) => {
        return { description, title: state.editState?.title ?? '' };
      }
    );
    this.state.connect(
      'boards',
      this.state.select('task').pipe(
        map((v) => v?.board.project.id),
        filter((v): v is NonNullable<typeof v> => v != null),
        switchMap((projectId) => {
          return this.apolloDataQuery.queryProject(
            {
              fields: PROJECT_FIELDS,
              name: 'ProjectPartsInTaskDialog',
            },
            projectId
          );
        }),
        map((v) => v.data.project),
        filter((v): v is NonNullable<typeof v> => v != null),
        map((project) => {
          return project.boards.map((board) => {
            return {
              id: board.id,
              name: board.name,
            };
          });
        })
      )
    );
    this.state.connect(
      'users',
      this.apolloDataQuery
        .queryUsers(
          { name: 'UserPartsInTaskDialog', fields: USER_FIELDS },
          { fetchPolicy: 'cache-only' }
        )
        .pipe(
          map((response) => {
            if (response.data?.users == null) {
              return [];
            }
            const { users } = response.data;
            return users.map((user) => {
              return {
                id: user.id,
                name: user.name,
                icon: user.icon,
              };
            });
          })
        )
    );
    this.state.connect('task', this.onClickedAddSubtask$, (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            subtasks: [...task.subtasks],
          };
    });
    this.state.hold(
      this.onClickedAddSubtask$.pipe(
        exhaustMap(() => {
          const task = this.state.get('task');
          if (task == null) {
            return of(undefined);
          }
          const input: CreateSubtaskInput = {
            title: '',
            taskId: task.id,
          };
          return this.createSubtaskUsecase.execute(input, {
            fields: SUBTASK_FIELDS,
            name: 'SubtaskPartsInTaskDialog',
          });
        }),
        tap((response) => {
          const subtask = response?.data?.createSubtask;
          if (subtask == null) return;
          this.state.set('task', ({ task }) => {
            if (task == null) return task;
            return {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: subtask.id,
                  title: subtask.title,
                  description: subtask.description,
                  isDone: subtask.isDone,
                  scheduledTimeSec: subtask.scheduledTimeSec,
                  workTimeSec: subtask.workTimeSec,
                  workStartDateTimestamp: subtask.workStartDateTimestamp,
                  taskId: subtask.task.id,
                  assignUser: subtask.assign,
                },
              ],
              subtasksOrder: [...task.subtasksOrder, subtask.id],
            };
          });
        })
      )
    );

    this.state.hold(this.onClickedCloseButton$, () => {
      this.taskDialogService.close();
    });
    this.state.hold(
      this.onClickedUpdateTitleAndDescButton$.pipe(
        exhaustMap(() => {
          return this.updateTitleAndDescription();
        })
      )
    );
    this.state.hold(
      this.onChangedAssignUser$.pipe(
        filter((id) => {
          return id !== this.state.get('task')?.assignUser?.id;
        }),
        exhaustMap((id) => {
          return this.updateAssignUser(id);
        })
      )
    );
    this.state.hold(
      this.onChangedStatus$.pipe(
        filter((status) => {
          return status !== this.state.get('task')?.status;
        }),
        exhaustMap((status) => {
          return this.updateStatus(status);
        })
      )
    );
    this.state.hold(
      this.onChangedBoard$.pipe(
        filter((boardId) => {
          return boardId !== this.state.get('task')?.board.id;
        }),
        exhaustMap((boardId) => {
          return this.updateBoard(boardId);
        })
      )
    );
    this.state.hold(
      this.onClickedPlay$.pipe(
        exhaustMap(() => {
          return this.startTracking();
        })
      )
    );
    this.state.hold(
      this.onClickedPause$.pipe(
        exhaustMap(() => {
          return this.stopTracking();
        })
      )
    );
    this.state.hold(
      this.onChangedWorkTimeSec$.pipe(
        startWith(this.state.get('task')?.workTimeSec ?? 0),
        pairwise(),
        filter(([prev, sec]) => {
          const diff = sec - prev;
          const isChangedByCtrlBtn = diff > 1;
          const isTracking =
            this.state.get('task')?.workStartDateTimestamp != null;
          return isChangedByCtrlBtn || !isTracking;
        }),
        map(([, current]) => current),
        filter((sec) => {
          return sec !== this.state.get('task')?.workTimeSec;
        }),
        exhaustMap((sec) => {
          return this.updateWorkTimeSec(sec);
        })
      )
    );
    this.state.hold(
      this.onChangedScheduledTimeSec$.pipe(
        filter((sec) => {
          return sec !== this.state.get('task')?.scheduledTimeSec;
        }),
        exhaustMap((sec) => {
          return this.updateScheduledTimeSec(sec);
        })
      )
    );
    this.state.hold(
      this.onDrop$.pipe(
        map((dropEvent) => {
          const task = this.state.get('task');
          if (task == null) {
            return [];
          }
          const subtasks = [...(task?.subtasks ?? [])];
          moveItemInArray(
            subtasks,
            dropEvent.previousIndex,
            dropEvent.currentIndex
          );
          return subtasks;
        }),
        tap((subtasks) => {
          const task = this.state.get('task');
          if (task == null) {
            return task;
          }
          const subtasksOrder = subtasks.map((v) => v.id);
          this.state.set('task', () => {
            return { ...task, subtasks, subtasksOrder };
          });
        }),
        exhaustMap((subtasks) => {
          return this.updateSubtasksOrder(subtasks.map((v) => v.id));
        })
      )
    );
    this.state.hold(
      this.onClickedTaskGroup$.pipe(
        switchMap(() => {
          const task = this.state.get('task');
          if (task == null || task?.taskGroup == null) return of(undefined);
          return this.apolloDataQuery.queryTaskGroup(
            { fields: TASKGROUP_FIELDS, name: 'TaskGroupPartsInTaskDialog' },
            task.taskGroup.id,
            { nextFetchPolicy: 'cache-only' }
          );
        }),
        map((v) => {
          return v?.data.taskGroup;
        }),
        filter((v): v is NonNullable<typeof v> => v != null),
        map((taskGroup) => {
          return convertToDomainTaskGroupFromApiTaskGroup(taskGroup);
        })
      ),
      (taskGroup) => {
        this.taskDialogService.pushContent(taskGroup);
      }
    );
    this.state.hold(
      this.onClickedSubtask$.pipe(
        switchMap(({ id }) => {
          return this.apolloDataQuery.querySubtask(
            { fields: SUBTASK_FIELDS, name: 'SubtaskPartsInTaskDialog' },
            id,
            {
              nextFetchPolicy: 'cache-only',
            }
          );
        }),
        map((v) => v.data.subtask),
        filter((v): v is NonNullable<typeof v> => v != null),
        map((subtask) => {
          return convertToDomainSubtaskFromApiSubtask(subtask);
        })
      ),
      (subtask) => {
        this.taskDialogService.pushContent(subtask);
      }
    );
    this.state.hold(
      this.onDelete$.pipe(
        exhaustMap(() => {
          const taskId = this.state.get('task')?.id;
          if (taskId == null) return of(undefined);
          const input: DeleteTaskInput = {
            id: taskId,
          };
          return this.deleteTaskUsecase.execute(input);
        }),
        switchMap(() => {
          this.taskDialogService.close();
          return this.notificationsService.show('タスクが削除されました', {
            hasCloseButton: true,
          });
        })
      )
    );
  }

  private updateTitleAndDescription() {
    const state = this.state.get();
    const editState = state.editState;
    if (editState == null) {
      return of(undefined);
    }
    const input = this.generateUpdateTaskInput({
      title: editState.title,
      description: editState.description,
    });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            title: editState.title,
            description: editState.description,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private updateAssignUser(userId?: User['id']) {
    const input = this.generateUpdateTaskInput({ assignUserId: userId });
    if (input == null) return of(undefined);
    if (userId == null) {
      input.assignUserId = undefined;
    }
    return this.updateTaskUsecase.execute(input);
  }

  private updateStatus(status: Task['status']) {
    const input = this.generateUpdateTaskInput({
      status: convertToApiStatusFromDomainStatus(status),
    });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            status,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private updateBoard(boardId: Board['id']) {
    const input = this.generateUpdateTaskInput({ boardId });
    if (input == null) return of(undefined);
    return this.updateTaskUsecase.execute(input);
  }

  private updateSubtasksOrder(subtasksOrder: Task['subtasksOrder']) {
    const input = this.generateUpdateTaskInput({ subtasksOrder });
    if (input == null) return of(undefined);
    return this.updateTaskUsecase.execute(input);
  }

  private startTracking() {
    const now = new Date().valueOf();
    const input = this.generateUpdateTaskInput({
      workStartDateTimestamp: now,
    });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            workStartDateTimestamp: now,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private stopTracking() {
    const start = this.state.get('task')?.workStartDateTimestamp;
    const currentWorkTimeSec = this.state.get('task')?.workTimeSec;
    if (start == null || currentWorkTimeSec == null) return of(undefined);
    const now = new Date().valueOf();
    const diffTimeMilliSec = now - start;
    const updatedWorkTimeSec =
      currentWorkTimeSec + Math.ceil(diffTimeMilliSec / 1000);
    const input = this.generateUpdateTaskInput({
      workTimeSec: updatedWorkTimeSec,
      workStartDateTimestamp: undefined,
    });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            workTimeSec: updatedWorkTimeSec,
            workStartDateTimestamp: undefined,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private updateWorkTimeSec(sec: Task['workTimeSec']) {
    const workStartDateTimestamp =
      this.state.get('task')?.workStartDateTimestamp && new Date().valueOf();
    const input = this.generateUpdateTaskInput({
      workTimeSec: sec,
      // トラッキング中に更新する場合、開始時間を更新する
      workStartDateTimestamp,
    });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            workTimeSec: sec,
            workStartDateTimestamp,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private updateScheduledTimeSec(sec: Task['scheduledTimeSec']) {
    const input = this.generateUpdateTaskInput({ scheduledTimeSec: sec });
    if (input == null) return of(undefined);
    this.state.set('task', (state) => {
      const task = state.task;
      return task == null
        ? task
        : {
            ...task,
            scheduledTimeSec: sec,
          };
    });
    return this.updateTaskUsecase.execute(input);
  }

  private generateUpdateTaskInput(updateValue: Partial<UpdateTaskInput>) {
    const task = this.state.get('task');
    if (task == null) {
      return undefined;
    }
    const input: UpdateTaskInput = {
      id: task.id,
      title: updateValue.title ?? task.title,
      description: updateValue.description ?? task.description,
      status:
        updateValue.status ?? convertToApiStatusFromDomainStatus(task.status),
      assignUserId: updateValue.assignUserId ?? task.assignUser?.id,
      workTimeSec: updateValue.workTimeSec ?? task.workTimeSec,
      scheduledTimeSec: updateValue.scheduledTimeSec ?? task.scheduledTimeSec,
      boardId: updateValue.boardId ?? task.board.id,
      subtasksOrder: updateValue.subtasksOrder ?? task.subtasksOrder,
      taskGroupId: updateValue.taskGroupId ?? task.taskGroup?.id,
      workStartDateTimestamp:
        updateValue.workStartDateTimestamp ?? task.workStartDateTimestamp,
    };
    return input;
  }
}