import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { Board } from '../board-select-popup/board-select-popup.component';

type State = {
  title: string;
  scheduledTimeSec?: number;
  workTimeSec?: number;
  isTracking: boolean;
  isHover: boolean;
  boards: Board[];
  selectedBoardId: Board['id'];
};

@Component({
  selector: 'ui-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class TaskCardComponent implements OnInit {
  @Input()
  set title(value: string) {
    this.state.set('title', () => value);
  }
  @Input()
  set scheduledTimeSec(value: number) {
    this.state.set('scheduledTimeSec', () => value);
  }
  @Input()
  set workTimeSec(value: number) {
    this.state.set('workTimeSec', () => value);
  }
  @Input()
  set isTracking(value: boolean) {
    this.state.set('isTracking', () => value);
  }
  @Input()
  set boardId(value: Board['id']) {
    this.state.set('selectedBoardId', () => value);
  }
  @Input()
  set boards(value: Board[]) {
    this.state.set('boards', () => value);
  }
  @Output() hover = new EventEmitter<boolean>();
  @Output() changedWorkTimeSec = new EventEmitter<number>();
  @Output() changedScheduledTimeSec = new EventEmitter<number>();
  @Output() clickedPlay = new EventEmitter<void>();
  @Output() clickedPause = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() selectBoard = new EventEmitter<Board['id']>();
  @Output() addSubtask = new EventEmitter<void>();
  @Output() clickedEdit = new EventEmitter<void>();

  // State
  readonly state$ = this.state.select();

  // Events
  readonly onChangedWorkTimeSec$ = new Subject<number>();
  readonly onChangedScheduledTimeSec$ = new Subject<number>();
  readonly openeDeleteConfirmPopup$ = new Subject<boolean>();
  readonly openeSelectBoardPopup$ = new Subject<boolean>();

  constructor(private state: RxState<State>) {
    this.state.set({
      title: '',
      isTracking: false,
      boards: [],
    });
  }

  ngOnInit() {
    this.state.connect('workTimeSec', this.onChangedWorkTimeSec$);
    this.state.connect('scheduledTimeSec', this.onChangedScheduledTimeSec$);
    this.state.hold(this.state.select('workTimeSec'), (sec) => {
      this.changedWorkTimeSec.emit(sec);
    });
    this.state.hold(this.state.select('scheduledTimeSec'), (sec) => {
      this.changedScheduledTimeSec.emit(sec);
    });
    this.state.hold(this.state.select('isHover'), (isHover) => {
      this.hover.emit(isHover);
    });
  }

  @HostListener('mouseenter', [])
  onMouseEnter() {
    this.state.set('isHover', () => true);
  }

  @HostListener('mouseleave', [])
  onMouseLeave() {
    this.state.set('isHover', () => false);
  }
}
