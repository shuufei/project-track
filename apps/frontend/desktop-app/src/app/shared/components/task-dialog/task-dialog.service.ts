import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Subtask, Task, TaskGroup } from '@bison/frontend/domain';
import { RxState } from '@rx-angular/state';
import { filter, map } from 'rxjs/operators';

export type TaskDialogServiceState = {
  isOpened: boolean;
  contentHistory: DialogContent[];
};

@Injectable({ providedIn: 'root' })
export class TaskDialogService {
  readonly state$ = this.state.select();
  readonly isOpened$ = this.state.select('isOpened');
  readonly contentHistory$ = this.state.select('contentHistory');
  readonly existsPrevContent$ = this.contentHistory$.pipe(
    map((history) => history.length >= 2)
  );
  readonly currentContent$ = this.contentHistory$.pipe(
    map((contentHistory) => {
      const latestContent = contentHistory[contentHistory.length - 1];
      return latestContent;
    }),
    filter((v): v is NonNullable<typeof v> => {
      return v != null;
    })
  );
  readonly currentContentType$ = this.currentContent$.pipe(map((v) => v.type));

  constructor(
    @Inject(TASK_DIALOG_SERVICE_STATE)
    private readonly state: RxState<TaskDialogServiceState>
  ) {
    this.resetState();
  }

  open() {
    this.state.set('isOpened', () => true);
  }

  close() {
    this.resetState();
  }

  pushContent(content: TaskDialogServiceState['contentHistory'][number]) {
    this.state.set('contentHistory', (state) => {
      return [...state.contentHistory, content];
    });
  }

  back() {
    if (this.state.get('contentHistory').length < 2) {
      return;
    }
    this.state.set('contentHistory', (state) => {
      const history = [...state.contentHistory];
      history.pop();
      return history;
    });
  }

  private resetState() {
    this.state.set({
      isOpened: false,
      contentHistory: [],
    });
  }
}

export const TASK_DIALOG_SERVICE_STATE = new InjectionToken<
  RxState<TaskDialogServiceState>
>('TaskDialogServiceState');

export type ContentType = 'TaskGroup' | 'Task' | 'Subtask';

export type DialogContent = {
  id: TaskGroup['id'] | Task['id'] | Subtask['id'];
  type: ContentType;
};
