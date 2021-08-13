import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ApolloDataQuery,
  APOLLO_DATA_QUERY,
  CreateSubtaskUsecase,
  CREATE_SUBTASK_USECASE,
  DeleteTaskUsecase,
  DELETE_TASK_USECASE,
  UpdateSubtaskUsecase,
  UpdateTaskUsecase,
  UPDATE_SUBTASK_USECASE,
  UPDATE_TASK_USECASE,
} from '@bison/frontend/application';
import {
  ButtonModule,
  CheckboxModule,
  DialogModule,
  IconModule,
  TextareaModule,
  TextFieldModule,
  TooltipModule,
} from '@bison/frontend/ui';
import { RxState } from '@rx-angular/state';
import { TuiNotificationsModule } from '@taiga-ui/core';
import { TaskFacadeModule } from '../../facade/task-facade/task-facade.module';
import { TaskGroupFacadeModule } from '../../facade/task-group-facade/task-group-facade.module';
import { DeleteConfirmPopupModule } from '../delete-confirm-popup/delete-confirm-popup.module';
import { SubtaskCardModule } from '../subtask-card/subtask-card.module';
import { TaskDialogAssignChangeButtonModule } from '../task-dialog-assign-change-button/task-dialog-assign-change-button.module';
import { TaskDialogBoardChangeButtonModule } from '../task-dialog-board-change-button/task-dialog-board-change-button.module';
import { TaskDialogProjectChangeButtonModule } from '../task-dialog-project-change-button/task-dialog-project-change-button.module';
import { TaskDialogStatusChangeButtonModule } from '../task-dialog-status-change-button/task-dialog-status-change-button.module';
import { TaskDialogTemplateModule } from '../task-dialog-template/task-dialog-template.module';
import { TrackingBarModule } from '../tracking-bar/tracking-bar.module';
import { TaskDialogSubtaskContentComponent } from './task-dialog-subtask-content/task-dialog-subtask-content.component';
import { TaskDialogTaskContentComponent } from './task-dialog-task-content/task-dialog-task-content.component';
import { TaskDialogTaskGroupContentComponent } from './task-dialog-task-group-content/task-dialog-task-group-content.component';
import { TaskDialogComponent } from './task-dialog.component';
import {
  TaskDialogService,
  TaskDialogServiceState,
  TASK_DIALOG_SERVICE_STATE,
} from './task-dialog.service';

@NgModule({
  declarations: [
    TaskDialogComponent,
    TaskDialogTaskContentComponent,
    TaskDialogSubtaskContentComponent,
    TaskDialogTaskGroupContentComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    TaskDialogTemplateModule,
    TrackingBarModule,
    TaskDialogStatusChangeButtonModule,
    TaskDialogAssignChangeButtonModule,
    TaskDialogProjectChangeButtonModule,
    TaskDialogBoardChangeButtonModule,
    IconModule,
    SubtaskCardModule,
    ButtonModule,
    TextFieldModule,
    TextareaModule,
    TooltipModule,
    DragDropModule,
    DeleteConfirmPopupModule,
    TuiNotificationsModule,
    CheckboxModule,
    TaskGroupFacadeModule,
    TaskFacadeModule,
  ],
  exports: [TaskDialogComponent],
  providers: [
    {
      provide: APOLLO_DATA_QUERY,
      useClass: ApolloDataQuery,
    },
    {
      provide: UPDATE_TASK_USECASE,
      useClass: UpdateTaskUsecase,
    },
    {
      provide: DELETE_TASK_USECASE,
      useClass: DeleteTaskUsecase,
    },
    {
      provide: CREATE_SUBTASK_USECASE,
      useClass: CreateSubtaskUsecase,
    },
    {
      provide: UPDATE_SUBTASK_USECASE,
      useClass: UpdateSubtaskUsecase,
    },
    TaskDialogService,
    {
      provide: TASK_DIALOG_SERVICE_STATE,
      useFactory: () => new RxState<TaskDialogServiceState>(),
    },
  ],
})
export class TaskDialogModule {}
