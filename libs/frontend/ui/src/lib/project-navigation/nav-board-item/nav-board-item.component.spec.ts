import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectNavigationModule } from '../project-navigation.module';
import { NavBoardItemComponent } from './nav-board-item.component';

describe('NavBoardItemComponent', () => {
  let component: NavBoardItemComponent;
  let fixture: ComponentFixture<NavBoardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNavigationModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBoardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
