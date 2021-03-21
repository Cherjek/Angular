import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilterCardMainComponent } from './components/filter-card-main/filter-card-main.component';
import { FilterCardTagTypesComponent } from './components/filter-card-tag-types/filter-card-tag-types.component';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { FilterBoundsService } from 'src/app/services/references/filter-bounds.service';
import { InlineGridColumn } from 'src/app/shared/rom-forms/inline-grid/models/InlineGridColumn';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: FilterCardMainComponent,
    children: [
      { path: '', redirectTo: 'bounds' },
      {
        path: 'bounds',
        component: InlineGridComponent,
        data: {
          service: FilterBoundsService,
          subServices: [
            {
              getMethod: 'getThresholdTypes',
              columnNames: ['ThresholdType']
            }
          ],
          columns: [
            {
              Name: 'TimestampThresholdIsActive',
              Caption: AppLocalization.ASignOfFilterTimeActivity,
              Type: 'Bool',
              MaxLength: 50,
            },
            {
              Name: 'TimestampThresholdSeconds',
              Caption: AppLocalization.FilterDurationFromThePreviousSavedValue,
              InputType: 'float',
              MaxLength: 50
            },
            {
              Name: 'LowerBoundIsActive',
              Caption: AppLocalization.LowerRangeActivity,
              Type: 'Bool',
              MaxLength: 50,
            },
            {
              Name: 'LowerBound',
              Caption: AppLocalization.LowerRange,
              InputType: 'float',
              MaxLength: 50
            },
            {
              Name: 'UpperBoundIsActive',
              Caption: AppLocalization.ASignOfUpperBandActivity,
              Type: 'Bool',
              MaxLength: 50,
            },
            {
              Name: 'UpperBound',
              Caption: AppLocalization.TopRange,
              InputType: 'float',
              MaxLength: 50
            },
            {
              Name: 'ThresholdType',
              Caption: AppLocalization.TheTypeOfChangeToSaveValue,
              Type: 'Option',
              MaxLength: 50,
              IsRequired: true,
            },
            {
              Name: 'AbsoluteThreshold',
              Caption: AppLocalization.AbsoluteValueOfASignificantDeviation,
              InputType: 'float',
              MaxLength: 50,
              IsRequired: true,
            },
            {
              Name: 'PercentThreshold',
              Caption: AppLocalization.PercentageOfValueChangeRelativeToPrevious,
              InputType: 'float',
              MaxLength: 50
            }
          ] as InlineGridColumn[],
          access: { add: 'CFG_TAG_FILTER_BOUNDS_ADD', edit: 'CFG_TAG_FILTER_BOUNDS_EDIT', delete: 'CFG_TAG_FILTER_BOUNDS_DELETE' }
        }
      },
      {
        path: 'tag-types',
        component: FilterCardTagTypesComponent,
        data: {
          access: ['REF_VIEW_LOGIC_DEVICE_TAGS','CFG_TAG_FILTER_TAGS_VIEW']
        },
        canActivate: [CanAccessGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilterCardRoutingModuleModule {}
