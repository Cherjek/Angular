import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataGrid } from 'src/app/controls/DataGrid';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { ISubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { CustomerNodes } from 'src/app/services/sub-personal-account/models/CustomerNodes';

@Component({
  selector: 'rom-pa-hierarchy-nodes',
  templateUrl: './pa-hierarchy-nodes.component.html',
  styleUrls: ['./pa-hierarchy-nodes.component.less'],
})
export class PaHierarchyNodesComponent implements OnInit {
  customerId: number;
  userHierarchyNodes: CustomerNodes[];
  loadingContentPanel = true;
  errorsContentForm: any[] = [];
  application: ISubPersonalAccount;

  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;

  constructor(
    private paSubscriberCardService: PaSubscriberCardService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.customerId = this.activedRoute.parent.snapshot.params.id;

    this.loadScheduleHierarchies();
  }

  changeHierarchies() {
    this.router.navigate([
      `sub-personal-account/hierarchy-edit/apps/${this.customerId}`,
    ]);
  }

  private loadScheduleHierarchies() {
    this.paSubscriberCardService.getAppsAndNodes(this.customerId).subscribe(
      (data) => {
        this.userHierarchyNodes = data[0];
        this.application = data[1] as ISubPersonalAccount;
        this.loadingContentPanel = false;
      },
      (error) => {
        this.errorsContentForm.push(error);
        this.loadingContentPanel = false;
      }
    );
  }
}
