import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'ui-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit, OnDestroy {
  @Input() triggerEl?: HTMLElement;
  @Input() isCloseWhenPopupAction = false;
  @Output() closed = new EventEmitter<void>();

  readonly isOpen$ = new BehaviorSubject<boolean>(false);

  private readonly onDestroy$ = new Subject<void>();

  private readonly changePopupPositionHandler$ = this.isOpen$.pipe(
    filter((isOpen) => isOpen),
    tap(() => {
      if (this.triggerEl === undefined) {
        return;
      }
      const triggerRect = this.triggerEl.getBoundingClientRect();
      const leftSpace = triggerRect.x;
      // TODO: windowをDI経由で利用するようにする
      const rightSpace =
        window.innerWidth - (triggerRect.x + triggerRect.width);
      (this.elementRef.nativeElement as HTMLElement).style[
        leftSpace > rightSpace ? 'right' : 'left'
      ] = '0';
    })
  );

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.triggerEl == null) {
      throw new Error('trigger element is undefined.');
    }
    merge(this.changePopupPositionHandler$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
    this.enableOpenPopupHandler();
    this.enableClosePopupHandler();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  private enableOpenPopupHandler() {
    if (this.triggerEl == null) {
      return;
    }
    fromEvent(this.triggerEl, 'click')
      .pipe(
        tap((e) => {
          this.isOpen$.next(true);
          e.stopPropagation();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  private enableClosePopupHandler() {
    this.zone.runOutsideAngular(() => {
      // stopPropagation()しているイベントも捕捉するため、capture: trueをつける。
      fromEvent(document, 'click', { capture: true })
        .pipe(
          filter((event) => {
            const isHostClicked = (this.elementRef
              .nativeElement as HTMLElement)?.contains(event.target as Node);
            const isTriggerCliked = this.triggerEl?.contains(
              event.target as Node
            );
            return (
              (this.isCloseWhenPopupAction ? true : !isHostClicked) &&
              !isTriggerCliked
            );
          }),
          tap(() => {
            this.isOpen$.next(false);
            this.closed.emit();
            this.cd.detectChanges();
          }),
          takeUntil(this.onDestroy$)
        )
        .subscribe();
    });
  }
}