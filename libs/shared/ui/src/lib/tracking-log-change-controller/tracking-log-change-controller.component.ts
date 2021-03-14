import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangedTimeEvent } from '../input-time/input-time.component';
import {
  convertToSecFromTime,
  convertToTimeFromSec,
} from '../utils/convert-time';

type State = {
  trackingTimeSec: number;
  plannedTimeSec: number;
  isTracking: boolean;
};

@Component({
  selector: 'ui-tracking-log-change-controller',
  templateUrl: './tracking-log-change-controller.component.html',
  styleUrls: ['./tracking-log-change-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class TrackingLogChangeControllerComponent implements OnInit {
  @Input()
  set trackingTimeSec(value: number) {
    this.state.set('trackingTimeSec', () => value);
  }
  @Input()
  set plannedTimeSec(value: number) {
    this.state.set('plannedTimeSec', () => value);
  }
  @Input()
  set isTracking(value: boolean) {
    this.state.set('isTracking', () => value);
  }
  @Output() changedTrackingTimeSec = new EventEmitter<number>();
  @Output() changedPlannedTimeSec = new EventEmitter<number>();

  // State
  readonly state$ = this.state.select();
  readonly trackingTime$ = this.state
    .select('trackingTimeSec')
    .pipe(map((sec) => convertToTimeFromSec(sec)));
  readonly plannedTime$ = this.state
    .select('plannedTimeSec')
    .pipe(map((sec) => convertToTimeFromSec(sec)));

  // Events
  readonly onChangedTrackingTime$ = new Subject<ChangedTimeEvent>();
  readonly onChangedPlannedTime$ = new Subject<ChangedTimeEvent>();

  constructor(private state: RxState<State>) {
    this.state.set({
      trackingTimeSec: 0,
      plannedTimeSec: 0,
      isTracking: false,
    });
  }

  ngOnInit() {
    this.state.connect(
      'trackingTimeSec',
      this.onChangedTrackingTime$,
      (_, time) => convertToSecFromTime(time.hours, time.minutes, time.seconds)
    );
    this.state.connect(
      'plannedTimeSec',
      this.onChangedPlannedTime$,
      (_, time) => convertToSecFromTime(time.hours, time.minutes, time.seconds)
    );
    this.state.hold(this.state.select('trackingTimeSec'), (sec) => {
      this.changedTrackingTimeSec.emit(sec);
    });
    this.state.hold(this.state.select('plannedTimeSec'), (sec) => {
      this.changedPlannedTimeSec.emit(sec);
    });
  }
}
