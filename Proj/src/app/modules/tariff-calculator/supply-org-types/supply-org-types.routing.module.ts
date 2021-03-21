import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { SupplyOrgTypeService } from 'src/app/services/tariff-calculator/supply-org-type.service';
const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: SupplyOrgTypeService,
      columns: 'getColumns',
      title: AppLocalization.NetworkOrganizations,
      config: { isDynamic: true },
      access: { add: 'TC_SUPPLY_ORGANIZATION_ADD', edit: 'TC_SUPPLY_ORGANIZATION_EDIT', delete: 'TC_SUPPLY_ORGANIZATION_DELETE' }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplyOrgTypesRoutingModule {}
