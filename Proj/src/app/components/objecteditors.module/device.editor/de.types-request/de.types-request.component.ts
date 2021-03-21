import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {
  DataQuerySettingsService,
  IDataQueryTypeChannelsView
} from 'src/app/services/data-query';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rom-de.types-request',
  templateUrl: './de.types-request.component.html',
  styleUrls: ['./de.types-request.component.css']
})
export class DETypesRequestComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  deviceTypeId: number;
  public dataQuery: IDataQueryTypeChannelsView[];
  data$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataQuerySettingsService: DataQuerySettingsService
  ) {
    this.deviceTypeId = activatedRoute.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.data$) {
      this.data$.unsubscribe();
    }
  }

  // сохранить изменения.
  save(dataQuery: IDataQueryTypeChannelsView[]) {
    this.loadingContent = true;
    this.dataQuerySettingsService
      .setUnitDeviceTypeDataQueryTypes(this.deviceTypeId, dataQuery)
      .then(() => this.loadData())
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  // отменить изменения
  cancel() {
    this.dataQuery = null;
    this.loadData();
  }

  // начальная загрузка данных.
  private loadData() {
    this.loadingContent = true;
    this.data$ = this.dataQuerySettingsService
      .getUnitDeviceTypeDataQueryTypes(this.deviceTypeId)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        data => {
          this.dataQuery = data;
        },
        error => (this.errors = [error])
      );
  }
}
