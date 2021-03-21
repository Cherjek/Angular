import { NgModule } from '@angular/core';
import { DateStringifyPipe } from './pipes/date-stringify.pipe';

@NgModule({
  declarations: [DateStringifyPipe],
  exports: [DateStringifyPipe]
})
export class SharedModule {}
