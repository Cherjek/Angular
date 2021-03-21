import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IFilterContainer } from '../../../../../services/common/Models/Filters/IFilterContainer';

@Component({
    selector: 'favorites',
    templateUrl: './favorites.html',
    styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {

    public loadingDuringRemoving = false;
    public errors: any[] = [];
    public searchText: string;

    public favTemps: any[];
    @Input() service: IFilterContainer;
    @Output() onSelectFavor = new EventEmitter<any>();

    constructor() { }

    private viewRendering(): void {
        this.loadingDuringRemoving = true;
        this.service.filtersTemplateService
            .get()
            .subscribe((data: any) => {
                this.loadingDuringRemoving = false;
                this.favTemps = data;
                console.log(this.favTemps);
            }, (error: any) => {
                this.loadingDuringRemoving = false;
                this.errors.push(error);
            });
    }

    ngOnInit() {
        this.viewRendering();
    }

    deleteTemplate(curr_favor: any) {
        this.loadingDuringRemoving = true;
        
        this.service.filtersTemplateService
            .delete(curr_favor.Id)
            .then((res: any) => {
                this.viewRendering();
            })
            .catch((error: any) => { this.errors.push(error); });
    }

    onFavoriteSelect(event: any, favor: any) {
        this.onSelectFavor.emit(favor);
    }
}