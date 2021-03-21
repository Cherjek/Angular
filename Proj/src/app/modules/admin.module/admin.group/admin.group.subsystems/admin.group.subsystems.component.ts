import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AdminGroupService } from '../../../../services/admin.module/admin.group/AdminGroup.service';
import { ISubSystemPermissionView } from 'src/app/services/admin.module/admin.group/Models/AdminSubSystem';

@Component({
  selector: 'rom-admin-group-subsystems',
  templateUrl: './admin.group.subsystems.component.html',
  styleUrls: ['./admin.group.subsystems.component.less'],
})
export class AdminGroupSubSystemsComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public loadingContent: boolean;
  private sub$: Subscription;
  private groupId: number;

  public editMode = false;

  private subsystems: ISubSystemPermissionView[];
  public subsystemsEdit: ISubSystemPermissionView[];

  constructor(
    private adminGroupService: AdminGroupService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sub$ = this.activatedRoute.parent.params.subscribe(
      (params: any) => {
        this.groupId = params.id;
      },
      (error: any) => {
        this.errors = [error];
      }
    );
  }

  ngOnInit() {
    this.initSubSystems();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private initSubSystems() {
    this.loadingContent = true;

    this.adminGroupService
      .getSubsystems(this.groupId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (subsystems: ISubSystemPermissionView[]) => {
          this.subsystems = subsystems;
          this.subsystemsEdit = this.cloneCurrentData();
        },
        (error: any) => {
          this.errors = [error];
        }
      );
  }

  private cloneCurrentData() {
    return this.subsystems.map((sub) => ({ ...sub }));
  }

  public saveChanges() {
    this.loadingContent = true;

    this.adminGroupService
      .postSubsystems(this.groupId, this.subsystemsEdit)
      .then(() => {
        this.editMode = false;
        this.initSubSystems();
      })
      .catch((error: any) => {
        this.errors = [error];
        this.loadingContent = false;
      });
  }

  public editCancel() {
    this.subsystemsEdit = this.cloneCurrentData();
    this.editMode = false;
  }
}
