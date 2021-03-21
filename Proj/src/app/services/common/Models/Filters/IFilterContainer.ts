import { Observable } from "rxjs";
import { IDataService } from "../../Data.service";

export interface IFilterContainer {

    filtersService: IFiltersService;
    filtersTemplateService: IFiltersTemplateService;
    filtersNewService: IFiltersNewService;
}

export interface IFiltersService extends IDataService<any> {

    getDefault(): Observable<any>;    

    upload(filter: any): Promise<Object>;
}

export interface IFiltersTemplateService extends IDataService<any> {

    create(data: any): Promise<object>;
}

export interface IFiltersNewService extends IDataService<any> {

    
}