import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminGroupService } from '../../../../services/admin.module/admin.group/AdminGroup.service';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { ListView } from '../../../../controls/ListView/ListView';
import { DataGrid } from '../../../../controls/DataGrid/DataGrid';
import { Navigate } from '../../../../controls/Navigate/Navigate';
import { Subscription } from 'rxjs';
import { PropertiesPanelComponent } from "../../../../shared/rom-forms";
import { DetailsRowComponent } from "../../../../controls/ListComponentCommon/DetailsRow/DetailsRow";
import { EntityType } from "../../../../services/common/Properties.service";

@Component({
    selector: 'admin-group-units',
    templateUrl: './admin-group-units.html',
    styleUrls: ['./admin-group-units.css']
})
export class AdminGroupUnitsComponent implements OnInit, OnDestroy {
    public errors: any[] = [];
    public subscrsLoading: boolean;
    private urlParamsSubscription: Subscription;
    private groupId: string | number;
    public isUnit = true;
    public navItems: NavigateItem[] = [
        {
            name: AppLocalization.Objects,
            code: 'units',
        },
        {
            name: AppLocalization.Label32,
            code: 'lds',
        }
    ];
    public subscribers: any[]; // все абоненты
    allUnits: any[]; // все объекты всех абонентов
    allLDs: any[];   // все оборудования всех абонентов
    allSubscrsClick: boolean; // признак клика по всем абонентам
    public currDGSource: any;
    DetailsRowComponents: DetailsRowComponent[] = [
        new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Unit)
    ];

    @ViewChild('NavigateMenu', { static: true }) private navigateMenu: Navigate;
    @ViewChild('unitLDsDG', { static: true }) private dataGrid: DataGrid;
    @ViewChild('subscribersLV', { static: true }) public subscribersLV: ListView;

    constructor(public adminGroupService: AdminGroupService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {
        this.urlParamsSubscription = this.activatedRoute.parent.params.subscribe(
            (params: any) => {
                this.groupId = params.id;
            },
            (error: any) => {
                this.errors = [error];
            }
        );
    }

    ngOnInit() {
        this.initDG();
        this.initSubscribers();
    }

    ngOnDestroy() {
        this.urlParamsSubscription.unsubscribe();
    }

    changeSubscrsUnitLDs() {
        this.router.navigate([`admin/group/${this.groupId}/units-edit`]);
    }

    initDG() {
        this.dataGrid.initDataGrid();
        this.dataGrid.Columns = [
            {
                Name: 'DisplayName'
            },
            {
                Name: 'AdditionalInfo'
            }
        ];
    }

    transformSubscribers(subscribers: any[]) { // обработка данных чтобы она подходила под шаблон строки unitLDsDGlTemplate в гриде unitLDsDG
        subscribers.forEach((subscriber: any) => {
            subscriber.Units.forEach((unit: any) => {
                unit.AdditionalInfo = unit.UnitAdditionalInfo;
                delete unit.UnitAdditionalInfo;

                unit.LogicDevices.forEach((ld: any) => {
                    ld.AdditionalInfo = unit.DisplayName;
                    ld.IdUnit = unit.Id;
                });
            });
        });
        return subscribers;
    }

    initAllUnitsAndAllLDs() {
        this.allUnits = [].concat(...this.subscribers.map((subscr: any) => subscr.Units));
        this.allLDs = [].concat(...this.allUnits.map((unit: any) => unit.LogicDevices));
    }

    initSubscribers() {
        this.subscrsLoading = true;
        this.adminGroupService
            .getSubscribers(this.groupId)
            .subscribe(
                (subscribers: any[]) => {
                    this.subscribers = this.transformSubscribers(subscribers);
                    this.initAllUnitsAndAllLDs();

                    this.subscrsLoading = false;
                },
                (error: any) => {
                    this.errors = [error];
                    this.subscrsLoading = false;
                });
    }

    onSubscrClick(event: any) {
        this.allSubscrsClick = false;
        if (this.navigateMenu.navigate.selectItem.code == 'units') { // вкладка Объекты
            this.currDGSource = event.Data.Units; // все объекты текущего абонента
        } else { // вкладка Оборудование
            const subscriberLDs: any[] = [].concat(...event.Data.Units.map((unit: any) => unit.LogicDevices)); // все оборудования всех объектов текущего абонента
            this.currDGSource = subscriberLDs;
        }
    }

    onAllSubscrsClick() {
        this.subscribersLV.dropFocus();
        this.allSubscrsClick = true;
        if (this.navigateMenu.navigate.selectItem.code === 'units') { // вкладка Объекты
            this.currDGSource = this.allUnits;
        } else { // вкладка Оборудование
            this.currDGSource = this.allLDs;
        }
    }

    private setDetailRowComponents(code: string) {
        let components: DetailsRowComponent[];
        if (code === "units") {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.Unit)
            ];
        } else {
            components = [
                new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.LogicDevice)
            ];
        }
        this.DetailsRowComponents = components;
    }

    onNavClick(event: any) {
        if (this.subscribersLV.focusedListItem) { // конкретный абонент кликнут
            if (event.code === 'units') { // вкладка Объекты
                this.currDGSource = this.subscribersLV.focusedListItem.Data.Units; // все объекты текущего абонента
            } else { // вкладка Оборудование
                const subscriberLDs: any[] = [].concat(...this.subscribersLV.focusedListItem.Data.Units.map(
                    (unit: any) => unit.LogicDevices)
                ); // все оборудования всех объектов текущего абонента
                this.currDGSource = subscriberLDs;
            }
        } else { // кликнуты Все абоненты
            if (event.code === 'units') { // вкладка Объекты
                this.currDGSource = this.allUnits;
            } else { // вкладка Оборудование
                this.currDGSource = this.allLDs;
            }
        }

        this.isUnit = event.code === 'units';

        this.setDetailRowComponents(event.code);
    }
}
