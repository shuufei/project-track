import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ApolloDataQuery,
  APOLLO_DATA_QUERY,
  UpdateBoardUsecase,
  UPDATE_BOARD_USECASE,
} from '@bison/frontend/application';
import {
  ButtonModule,
  SheetFooterModule,
  SheetModule,
} from '@bison/frontend/ui';
import { BoardPropertyEditFormModule } from '../board-property-edit-form/board-property-edit-form.module';
import { BoardUpdateSheetComponent } from './board-update-sheet.component';

@NgModule({
  declarations: [BoardUpdateSheetComponent],
  imports: [
    CommonModule,
    SheetModule,
    SheetFooterModule,
    ButtonModule,
    BoardPropertyEditFormModule,
  ],
  exports: [BoardUpdateSheetComponent],
  providers: [
    {
      provide: UPDATE_BOARD_USECASE,
      useClass: UpdateBoardUsecase,
    },
    {
      provide: APOLLO_DATA_QUERY,
      useClass: ApolloDataQuery,
    },
  ],
})
export class BoardUpdateSheetModule {}
