import { Component, OnInit } from '@angular/core';
import { AccessListService } from '../../services/access-list.service';
import { AccessList } from '../../../../services/admin.module/interfaces/access-list';
import { finalize } from "rxjs/operators";

@Component({
    selector: 'rom-access-list',
    templateUrl: './access-list.component.html',
    styleUrls: ['./access-list.component.less']
})
export class AccessListComponent implements OnInit {

    private errors: any[] = [];
    public loadingContentPanel: boolean;

    /** Массив модулей с правами доступа
     * @var accessList IAccessList[]
     */
    public accessList: AccessList[] = [];
    /** Индекс активного таба
     * @var activeAccessListItem number
     */
    public activeAccessListItem: number = 0;

    /**
     * @param accessListService AccessListService
     */
    constructor(private accessListService: AccessListService) {
    }

    ngOnInit() {
        this.getModulesAccessList();
    }

    /**
     * Получение accessList
     * @link accessList
     */
    private getModulesAccessList(): void {
        this.loadingContentPanel = true;
        this.accessListService.getModulesAccessList()
            .pipe(
                finalize(() => {
                    this.loadingContentPanel = false;
                })
            )
            .subscribe(
                (response) => {
                    this.accessList = response;
                },
                (error) => {
                    this.errors = [error];
                }
        );
    }
}
