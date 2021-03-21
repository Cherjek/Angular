import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { DataQuerySettingsService, IDataQueryTypeChannelsView } from '../../../../../../services/data-query';

@Component({
    selector: 'rom-request-card-dataqueue',
    templateUrl: './request-card-dataqueue.component.html',
    styleUrls: ['./request-card-dataqueue.component.less']
})
export class RequestCardDataqueueComponent implements OnInit {

    public loadingContent: boolean;
    public errors: any[] = [];
    public dataQuery: IDataQueryTypeChannelsView[];
    
    private deviceTypeId: number;

    constructor(private activatedRoute: ActivatedRoute,
                private dataQuerySettingsService: DataQuerySettingsService) { 
        
        this.deviceTypeId = activatedRoute.parent.snapshot.params.id;
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.loadingContent = true;
        this.dataQuerySettingsService
            .getDeviceTypeDataQueryTypes(this.deviceTypeId)
            .pipe(
                finalize(() => this.loadingContent = false)
            )
            .subscribe(data => {
                this.dataQuery = data;
            }, (error) => this.errors = [error]); 
    }

    save(dataQuery: IDataQueryTypeChannelsView[]) {
        this.loadingContent = true;
        this.dataQuerySettingsService
            .setDeviceTypeDataQueryTypes(this.deviceTypeId, dataQuery)
            .then(() => this.loadData())
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }

    cancel() {
        this.dataQuery = null;
        this.loadData();
    }
}
