import { AppLocalization } from 'src/app/common/LocaleRes';
// tslint:disable-next-line: max-line-length
import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalValues, Utils, PermissionCheck, AccessDirectiveConfig } from '../../../../core';
import { PersonalAccountService } from '../../../../services/personalaccount.module/PersonalAccount.service';
import { DetailsContentViewHostDirective } from '../../directives/details-content-view-host.directive';
import { CommonTypeComponent } from '../dynamic/common-type/common-type.component';
import { SpecificTypeComponent } from '../dynamic/specific-type/specific-type.component';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

const commonCode = 'Common';
const commonConst = AppLocalization.Label34;
const localStorageTabSelectKey = 'PersonalAccountComponent.storageTabSelectKey';

@Component({
  selector: 'personal-account',
    templateUrl: './personal-account.component.html',
    styleUrls: ['./personal-account.component.less']
})
export class PersonalAccountComponent implements OnInit, OnDestroy {

    public loadingContentPanel: boolean;
    public errors: any[] = [];
    public commonCode: string = commonCode;

    private get currentTabStorage(): string {
        return localStorage.getItem(localStorageTabSelectKey);
    }
    private set currentTabStorage(code: string) {
        if (code == null) {
            localStorage.removeItem(localStorageTabSelectKey);
        } else {
            localStorage.setItem(localStorageTabSelectKey, code);
        }
    }
    public currentTab: Tab;
    public tabs: Tab[];
    private componentRef: ComponentRef<any>;
    public get isTableLoad() {

        if (GlobalValues.Instance.Page) {
            return GlobalValues.Instance.Page.isTableLoad;
        }

        return false;
    }

    public get currentTabIndex(): number {

        if (this.currentTab != null) {
            const tabFind = this.tabs.find(x => x.Code === this.currentTab.Code);
            return this.tabs.indexOf(tabFind);
        }

        return 0;
    }

    @ViewChild(DetailsContentViewHostDirective, { static: true }) private detailsHost: DetailsContentViewHostDirective;
    @ViewChild('headerUnitLDContainer', { static: true }) headerUnitLDContainer: ElementRef;
    @ViewChild('detailsContainer', { static: true }) detailsContainer: ElementRef;

    private get widthContainer(): number {
        if (this.detailsContainer != null) {
            return this.detailsContainer.nativeElement.clientWidth;
        }
        return 0;
    }
    private get headerHeight(): number {
        if (this.headerUnitLDContainer != null) {
            return this.headerUnitLDContainer.nativeElement.clientHeight;
        }
        return 0;
    }

    constructor(private personalAccountService: PersonalAccountService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private permissionCheck: PermissionCheck,
                public router: Router) {
    }

    ngOnInit() {
        this.initTypeUnitLDs();
    }

    ngOnDestroy(): void {
        this.currentTabStorage = null;
    }

    private addCommonTab(data: any[]) {
        const tab = new Tab();
        tab.Code = this.commonCode;
        tab.DisplayText = commonConst;
        tab.UnitPresentationViews =
            data.map(x => x.UnitPresentationViews)
                .reduce((r: any[], list: any[]) => [...r, ...list]);
        this.tabs = [tab];
    }
    private accessTabMenu(data: any[]) {

        if (data == null || !data.length) return;

        const checkAccess = ['PA_COMMON'];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[] | AccessDirectiveConfig) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin(obsrvs)
            .pipe(
                finalize(() => {
                    this.initTabs(data);
                })
            )
            .subscribe((response: any[]) => {
                if (response[0]) {
                    this.addCommonTab(data);
                }
            });

    }
    private initTabs(data: any[]): void {
        
        this.tabs = this.tabs || [];

        data.forEach((type: any) => {
            this.tabs.push(Object.assign(new Tab(), type));
        });

        let tabClick: Tab;
        if (this.currentTabStorage != null) {
            tabClick = this.tabs.find(x => x.Code === this.currentTabStorage);
        } 
        if (tabClick == null) {
            tabClick = this.tabs[0];
        }

        this.onTabClick(tabClick);
    }

    private initTypeUnitLDs() {
        this.loadingContentPanel = true;
        this.personalAccountService.getData().subscribe(
            (data: any[]) => {
                this.accessTabMenu(data);

                this.loadingContentPanel = false;
            },
            (error: any) => {
                this.errors = [error];
                this.loadingContentPanel = false;
            });
    }

    public onTabClick(tab: Tab) {
        this.currentTab = tab;
        this.currentTabStorage = tab.Code;

        // если еще не установлены выбранные unit и ld, устанавливаем,
        // при переключениях между вкладками, будут сохранены выборы
        if (this.currentTab.TabSelect == null) {
            this.currentTab.TabSelect = new TabSelect();
            if (this.currentTab.UnitPresentationViews != null && this.currentTab.UnitPresentationViews.length) {
                this.currentTab.TabSelect.Unit = this.currentTab.UnitPresentationViews[0];
                if (this.currentTab.UnitPresentationViews[0].LogicDevices != null && 
                    this.currentTab.UnitPresentationViews[0].LogicDevices.length) {
                    this.currentTab.TabSelect.LogicDevice = this.currentTab.UnitPresentationViews[0].LogicDevices[0];
                }
            }
        }

        this.initDynamicComponent();
    }

    public selectTabUnit(unitSelect: any) {
        this.currentTab.TabSelect.Unit = unitSelect;

        if (this.currentTab.Code !== this.commonCode) {
            if (unitSelect.LogicDevices != null && unitSelect.LogicDevices.length) {
                this.selectTabLogicDevice(unitSelect.LogicDevices[0]);
            }
        } else {
            this.componentRef.instance.unit = this.currentTab.TabSelect.Unit;
        }
    }

    public selectTabLogicDevice(logicDevice: any) {
        this.componentRef.instance.logicDevice =
            this.currentTab.TabSelect.LogicDevice =
                logicDevice;
    }

    private initDynamicComponent() {
        const dynamicComponent: Type<any> = this.currentTab.DisplayText == commonConst ? CommonTypeComponent : SpecificTypeComponent;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicComponent);

        const viewContainerRef = this.detailsHost.viewContainerRef;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.logicDevice = this.currentTab.TabSelect.LogicDevice;
        this.componentRef.instance.unit = this.currentTab.TabSelect.Unit;

        this.onResize();
    }

    clickPortraitType(event: any) {
        this.onTabClick(this.tabs[event.index]);
    }

    @HostListener('window:resize')
    public onResize() {

        const fnc = () => {
            if (this.componentRef != null && this.headerUnitLDContainer != null && this.detailsContainer != null) {
                this.componentRef.instance.height = this.calcDetailsHeight();
                this.componentRef.instance.width = this.calcDetailsWidth();
            }
        };

        setTimeout(() => { fnc(); });
    }

    private calcDetailsHeight(): number {
        let scale = 0;
        if (this.orientationScreen === 'landscape') {
            scale = 50;
        } else {
            scale = 100;
        }
        return Utils.UtilsTools.windowScreenHeight - this.headerHeight - scale;
    }

    private calcDetailsWidth(): number {
        let scale = 0;
        if (this.orientationScreen === 'landscape') {
            scale = Utils.UtilsTools.windowScreenWidth - this.widthContainer;
        }
        return Utils.UtilsTools.windowScreenWidth - scale;
    }

    private get orientationScreen(): string {
        return Utils.UtilsTools.getWindowOrientationScreen();
    }
}

interface ICurr {
    curr: ICurrItem;
}

interface ICurrItem {
    ind: number;
    item: any;
}

class Tab {
    Code: string;
    DisplayText: string;
    UnitPresentationViews: any[];
    TabSelect: TabSelect;
}

class TabSelect {
    Unit: any;
    LogicDevice: any;
}
