import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestResultEquipmentsService } from 'src/app/services/requests.module/Result/request-result-equipments.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeListCheckedService } from 'src/app/shared/rom-forms/treeList.checked.panel';
import { IHierarchyNodeView } from 'src/app/services/additionally-hierarchies';

@Component({
  selector: 'rom-request-result-equipments',
  templateUrl: './request-result-equipments.component.html',
  styleUrls: ['./request-result-equipments.component.css'],
  providers: [RequestResultEquipmentsService]
})
export class RequestResultEquipmentsComponent implements OnInit, OnDestroy {
  loadingContentPanel = true;
  errorsObjectsValidationForms: any[] = [];
  deviceTypeId: number;
  subscription$: Subscription;
  deviceObjects: any;
  Nodes: any;

  constructor(
    private reqEquipmentsService: RequestResultEquipmentsService,
    private activatedRoute: ActivatedRoute,
    public treeListCheckedService: TreeListCheckedService
  ) {
    this.subscription$ = activatedRoute.parent.params.subscribe(
      params => (this.deviceTypeId = params.id)
    );
  }

  ngOnInit() {
    this.loadData();
  }
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private loadData(): void {
    this.reqEquipmentsService
      .getData(this.deviceTypeId)
      .subscribe((data: IHierarchyNodeView[]) => {
        this.loadingContentPanel = false;
        this.deviceObjects = data;
        this.Nodes = data;
      });
  }
}
