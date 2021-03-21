import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  DetailsRow,
  DetailsRowComponent,
} from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';
import { RequestService } from 'src/app/services/sub-personal-account/requests/request.service';
import { PropertyComponent } from 'src/app/modules/additionally-hierarchies/node-card/components/property/property.component';
import { DataGrid } from 'src/app/controls/DataGrid';

@Component({
  selector: 'rom-pa-request-card-hierarchy-node',
  templateUrl: './pa-request-card-hierarchy-node.component.html',
  styleUrls: ['./pa-request-card-hierarchy-node.component.less'],
})
export class PaRequestCardHierarchyNodeComponent implements OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('nodeTypeCellTemplate', { static: true })
  public nodeTypeCellTemplate: DataGrid;
  route$: Subscription;
  requestId: number | string;
  sub$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService
  ) {
    this.route$ = this.activatedRoute.parent.params.subscribe((params) => {
      this.requestId = params.id;
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.unsubscriber([this.route$, this.sub$]);
  }

  loadData() {
    this.sub$ = this.requestService.get(this.requestId).subscribe((data) => {
      if (data && data.HierarchyNodes) {
        this.initDG(data.HierarchyNodes);
      }
    });
  }

  private initDG(data: any) {
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.TheNameOfTheSite,
        AppendFilter: false,
        disableTextWrap: true,
      },
      {
        Name: 'NodeType',
        Caption: AppLocalization.NodeTypeName,
        CellTemplate: this.nodeTypeCellTemplate,
      },
    ];
    const detailsRow = new DetailsRow();
    detailsRow.components = [
      new DetailsRowComponent(AppLocalization.Properties, PropertyComponent, {
        IsRequestCard: true,
      }),
    ];

    this.dataGrid.DetailRow = detailsRow;
    this.dataGrid.DataSource = data;
  }

  unsubscriber(subs: Subscription[]) {
    subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
