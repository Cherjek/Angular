import {Component, OnDestroy, OnInit} from '@angular/core';
import { LogicDeviceTypesService } from "../../../../services/objecteditors.module/logicDevice.editor/LogicDeviceTypes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'ld-types',
  templateUrl: './logicdevice.types.html',
  styleUrls: ['./logicdevice.types.css']
})
export class LogicDeviceTypesComponent implements OnInit, OnDestroy {
    ldTypes$: Subscription;

  constructor(public ldTypesService: LogicDeviceTypesService,
              public router: Router,
              public activatedRoute: ActivatedRoute) {
      this.subscription = this.activatedRoute.queryParams.subscribe((params: any) => {
          this.unitId = params['unitId'];
      });
  }

  unitId: number;
  subscription: Subscription;
  typesSource: any[];
  loadingContent: boolean = true;
  errors: any[] = [];

  ngOnInit() {
      this.ldTypes$ = this.ldTypesService.get().subscribe(
          (types: any) => {
              this.typesSource = types;
              this.loadingContent = false;
        },
          (error: any) => {
              this.loadingContent = false;
              this.errors.push[error];
        }
      );
  }

  onItemClick(event: any) {
      let queryParams: any = {};
      queryParams['unitId'] = this.unitId;
      queryParams['ldType'] = JSON.stringify(event.Data);
      this.router.navigate(['../properties'],
            {
                queryParams: queryParams,
                relativeTo: this.activatedRoute
            });
  }

  ngOnDestroy() {
    this.unsubscriber([this.subscription, this.ldTypes$]);
    }

    unsubscriber(subs: Subscription[]) {
    subs.forEach(sub => {
        if (sub) { sub.unsubscribe(); }
    });
    }
}
