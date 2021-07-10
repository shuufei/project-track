import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ME_STATE_QUERY,
  PROJECT_STATE_QUERY_SERVICE,
} from '@bison/frontend/application';
import { ProjectListPageComponent } from '../project-list-page.component';
import { ProjectListPageModule } from '../project-list-page.module';
import {
  MockMeStateQueryService,
  mockProjects,
  MockProjectStateQueryService,
} from './mock';
import { ProjectListPageComponentHarness } from './project-list-page.component.harness';

describe('ProjectListPageComponent', () => {
  let component: ProjectListPageComponent;
  let fixture: ComponentFixture<ProjectListPageComponent>;
  let harness: ProjectListPageComponentHarness;
  const mockProjectStateQueryService = new MockProjectStateQueryService();
  const mockMeStateQuery = new MockMeStateQueryService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListPageModule, RouterTestingModule],
      providers: [
        {
          provide: PROJECT_STATE_QUERY_SERVICE,
          useValue: mockProjectStateQueryService,
        },
        {
          provide: ME_STATE_QUERY,
          useValue: mockMeStateQuery,
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ProjectListPageComponent);
    component = fixture.componentInstance;
    harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ProjectListPageComponentHarness
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('プロジェクト一覧が表示される', async () => {
    const elements = await harness.getProjectElements();
    expect(elements.length).toBe(mockProjects.length);
  });
});
