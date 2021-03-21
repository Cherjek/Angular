import { Truncate } from './truncate';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from './date-format.pipe';
import { DateTimeFormatPipe } from './date-time-format.pipe';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { FilterRowPipe } from './filter-row.pipe';
import { MarkerTextPipe } from './marker-text.pipe';
import { NoNamePipe } from './no-name.pipe';
import { ObjNgForPipe } from './obj-ng-for.pipe';
import { OrderByPipe } from './order-by.pipe';
import { SearchRowPipe } from './search-row.pipe';
import { SafeUrl } from './safe-url.pipe';
import { DateSlicePipe } from './date-slice.pipe';

@NgModule({
  declarations: [	
    DateFormatPipe,
    DateTimeFormatPipe,
    DecimalFormatPipe,
    FilterRowPipe,
    MarkerTextPipe,
    NoNamePipe,
    ObjNgForPipe,
    OrderByPipe,
    SearchRowPipe,
    Truncate,
    SafeUrl,
    DateSlicePipe
   ],
  imports: [
    CommonModule,
  ],
  exports: [
    DateFormatPipe,
    DateTimeFormatPipe,
    DecimalFormatPipe,
    FilterRowPipe,
    MarkerTextPipe,
    NoNamePipe,
    ObjNgForPipe,
    OrderByPipe,
    SearchRowPipe,
    Truncate,
    SafeUrl,
    DateSlicePipe
  ],
})
export class RomPipesModule { }
