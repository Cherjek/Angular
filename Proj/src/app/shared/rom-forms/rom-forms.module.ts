import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* common component */
import { FiltersCustomPanelComponent } from './filters.custompanel/filters.custompanel';
import { NewFilterComponent } from './filters.custompanel/Components/new.filter/new.filter';
import { FavoritesComponent } from './filters.custompanel/Components/favorites/favorites';
import { FilterArrayComponent } from './filters.custompanel/Components/filter.array.component/filter.array.component';
import { ListViewFilter } from './filters.custompanel/Components/ListView';

import { FiltersPanelComponent } from './filters.panel/filters.panel';
import { ObjectsPanelComponent } from './objects.panel/objects.panel';
import { MessagePopupComponent } from './message.popup/message.popup';
import { BackwardButtonComponent } from './backward.button/backward.button';
import { PropertiesPanelComponent } from './properties.panel/properties.panel';
import { PropertiesEditorPanelComponent } from './properties.editor.panel/properties.editor.panel';
import { TreeListCheckedPanelComponent } from './treeList.checked.panel/treeList.checked.panel';
import { SortTreeListDataPipe } from './treeList.checked.panel/Pipes/sort-treeList-data.pipe';
import { NavigateItemTemplateComponent } from './navigate-item-template/navigate-item-template.component';

/* controls */
import { ControlsModule } from '../../controls/ct.module';
import { RomDirectivesModule } from '../rom-directives/rom-directives.module';
import { InlineGridComponent } from './inline-grid/inline-grid.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        ControlsModule,
        RomDirectivesModule,
        RouterModule
    ],
    exports: [
        FiltersCustomPanelComponent,
        FiltersPanelComponent,
        ObjectsPanelComponent,
        MessagePopupComponent,
        BackwardButtonComponent,
        PropertiesPanelComponent,
        PropertiesEditorPanelComponent,
        TreeListCheckedPanelComponent,
        NavigateItemTemplateComponent,
        ListViewFilter,
        InlineGridComponent
    ],
    entryComponents: [
        PropertiesPanelComponent
    ],
    declarations: [
        FiltersCustomPanelComponent,
        NewFilterComponent,
        FavoritesComponent,
        FilterArrayComponent,
        ListViewFilter,
        FiltersPanelComponent,
        ObjectsPanelComponent,
        MessagePopupComponent,
        BackwardButtonComponent,
        PropertiesPanelComponent,
        PropertiesEditorPanelComponent,
        TreeListCheckedPanelComponent,
        SortTreeListDataPipe,
        NavigateItemTemplateComponent,
        InlineGridComponent
    ]
})
export class RomFormsModule { }
