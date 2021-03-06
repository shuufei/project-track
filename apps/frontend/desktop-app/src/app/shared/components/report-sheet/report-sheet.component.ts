import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  APOLLO_DATA_QUERY,
  IApolloDataQuery,
} from '@bison/frontend/application';
import { Board, Subtask, Task, TaskGroup } from '@bison/frontend/domain';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { convertToDomainBoardFromApiBoard } from '../../../util/convert-to-domain-board-from-api-board';
import { nonNullable } from '../../../util/custom-operators/non-nullable';
import {
  BOARD_FIELDS,
  BOARD_FRAGMENT_NAME,
} from '../../fragments/board-fragment';

type State = {
  boardId: Board['id'];
  board: Board;
  maxTimeSec?: number;
};

type TaskReportList = (
  | { item: Task; type: 'task' }
  | { item: TaskGroup; type: 'taskGroup' }
)[];

@Component({
  selector: 'bis-report-sheet',
  templateUrl: './report-sheet.component.html',
  styleUrls: ['./report-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ReportSheetComponent implements OnInit {
  @Input() triggerEl?: HTMLElement;
  @Input()
  set boardId(value: State['boardId']) {
    this.state.set('boardId', () => value);
  }

  readonly state$ = this.state.select();
  readonly taskReportList$: Observable<TaskReportList> = this.state
    .select('board')
    .pipe(
      map((board) => {
        const taskReprotList: TaskReportList = board.tasksOrder
          .map((orderItem) => {
            const item =
              orderItem.type === 'Task'
                ? board.soloTasks.find((v) => v.id === orderItem.taskId)
                : board.taskGroups.find((v) => v.id === orderItem.taskId);
            const type: TaskReportList[number]['type'] =
              orderItem.type === 'Task' ? 'task' : 'taskGroup';
            return (
              item && {
                item,
                type,
              }
            );
          })
          .filter((v): v is TaskReportList[number] => v != null);
        const remainedTaskGroups: TaskReportList = board.taskGroups
          .filter((taskGroup) => {
            return !taskReprotList.find((v) => v.item.id === taskGroup.id);
          })
          .map((taskGroup) => ({ item: taskGroup, type: 'taskGroup' }));
        const remainedTasks: TaskReportList = board.soloTasks
          .filter((task) => {
            return !taskReprotList.find((v) => v.item.id === task.id);
          })
          .map((task) => ({ item: task, type: 'task' }));
        return [...taskReprotList, ...remainedTaskGroups, ...remainedTasks];
      })
    );

  constructor(
    private state: RxState<State>,
    @Inject(APOLLO_DATA_QUERY) private apolloDataQuery: IApolloDataQuery
  ) {}

  ngOnInit(): void {
    this.state.connect(
      'board',
      this.state.select('boardId').pipe(
        switchMap((boardId) => {
          return this.queryBoard(boardId);
        })
      )
    );
    this.state.connect('maxTimeSec', this.state.select('board'), (_, board) => {
      const soloTasksMaxTimeSec = board.soloTasks.reduce((acc, curr) => {
        const sec = this.getTaskMaxTimeSec(curr);
        return sec > acc ? sec : acc;
      }, 0);
      const taskGroupsMaxTimeSec = board.taskGroups.reduce((acc, curr) => {
        const sec = this.getTaskGroupMaxTimeSec(curr);
        return sec > acc ? sec : acc;
      }, 0);
      const sec =
        soloTasksMaxTimeSec > taskGroupsMaxTimeSec
          ? soloTasksMaxTimeSec
          : taskGroupsMaxTimeSec;
      return sec;
    });
  }

  private getTaskGroupMaxTimeSec(taskGroup: TaskGroup) {
    const taskGroupWorkTimeSec = taskGroup.tasks.reduce(
      (acc, curr) => acc + curr.workTimeSec,
      0
    );
    const taskGroupSec =
      taskGroupWorkTimeSec > (taskGroup.scheduledTimeSec ?? 0)
        ? taskGroupWorkTimeSec
        : taskGroup.scheduledTimeSec ?? 0;
    const tasksMaxTimeSec = taskGroup.tasks.reduce((acc, curr) => {
      const taskMaxSec = this.getTaskMaxTimeSec(curr);
      return taskMaxSec > acc ? taskMaxSec : acc;
    }, 0);
    return taskGroupSec > tasksMaxTimeSec ? taskGroupSec : tasksMaxTimeSec;
  }

  private getTaskMaxTimeSec(task: Task) {
    const subtaskMaxTimeSec = this.getSubtasksMaxTimeSec(task.subtasks);
    const sec =
      (task.scheduledTimeSec ?? 0) > task.workTimeSec
        ? task.scheduledTimeSec ?? 0
        : task.workTimeSec;
    return sec > subtaskMaxTimeSec ? sec : subtaskMaxTimeSec;
  }

  private getSubtasksMaxTimeSec(subtasks: Subtask[]) {
    return subtasks.reduce((maxTimeSec, subtask) => {
      const subtaskSec =
        (subtask.scheduledTimeSec ?? 0) > subtask.workTimeSec
          ? subtask.scheduledTimeSec ?? 0
          : subtask.workTimeSec;
      return subtaskSec > maxTimeSec ? subtaskSec : maxTimeSec;
    }, 0);
  }

  private queryBoard(boardId: Board['id']): Observable<Board> {
    return this.apolloDataQuery
      .queryBoard(
        {
          fields: BOARD_FIELDS,
          name: BOARD_FRAGMENT_NAME,
        },
        boardId
      )
      .pipe(
        map((res) => res?.data?.board),
        nonNullable(),
        map((board) => {
          return convertToDomainBoardFromApiBoard(board);
        })
      );
  }
}
