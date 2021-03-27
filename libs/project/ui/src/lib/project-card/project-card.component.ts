import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import type { Color } from '@bison/shared/domain';
import { RxState } from '@rx-angular/state';

type State = {
  title: string;
  color: Color;
  description: string;
  adminImg?: string;
  memberImgs: (string | undefined)[];
  underDivide: boolean;
  isHover: boolean;
};

@Component({
  selector: 'ui-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ProjectCardComponent {
  @Input()
  set title(value: string) {
    this.state.set('title', () => value);
  }
  @Input()
  set color(value: Color) {
    this.state.set('color', () => value);
  }
  @Input()
  set description(value: string) {
    this.state.set('description', () => value);
  }
  @Input()
  set adminImg(value: string | undefined) {
    this.state.set('adminImg', () => value);
  }
  @Input()
  set memberImgs(value: (string | undefined)[]) {
    this.state.set('memberImgs', () => value);
  }
  @Input()
  set underDivide(value: boolean) {
    this.state.set('underDivide', () => value);
  }
  @Output() clickedDelete = new EventEmitter();

  // State
  readonly state$ = this.state.select();

  constructor(private state: RxState<State>) {
    this.state.set({
      title: '',
      color: 'gray',
      description: '',
      memberImgs: [],
      underDivide: false,
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
