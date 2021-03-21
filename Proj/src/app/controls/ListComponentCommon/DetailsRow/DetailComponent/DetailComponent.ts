import { Component, Input, OnInit, ComponentFactoryResolver, ViewChild, EventEmitter } from '@angular/core';

import { IDetailsRow, IDetailsRowComponent } from "../IDetailsRow"
import { DetailViewHostDirective } from "../Directives/DetailViewHost";

import { NavigateItem } from "../../../../common/models/Navigate/NavigateItem";
import { IDetailsComponent } from "../IDetailsComponent";

@Component({
    selector: 'detail-component-ro5',
    templateUrl: 'DetailComponent.html',
    styleUrls: ['DetailComponent.css']
})

export class DetailComponent implements OnInit {
    hasPermission = true;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    @Input() DetailRow: IDetailsRow;
    @ViewChild(DetailViewHostDirective, { static: true }) adHost: DetailViewHostDirective;
    Menu: NavigateItem[] = [];

    ngOnInit(): void {

        if (this.DetailRow != null) {

            let components = (this.DetailRow.components || []);
            components.forEach((d: IDetailsRowComponent, index: number) => {
                let ni = new NavigateItem();
                ni.name = d.caption;
                ni.code = `component${index}`;
                this.Menu.push(ni);
            });

            this.selectView(0);
        }
    }

    onNavSelectChanged(navItem: NavigateItem) {
        let index = this.Menu.indexOf(navItem);
        this.selectView(index);
    }

    selectView(index: number) {
        if(this.DetailRow.components && this.DetailRow.components.length) {
        let view = this.DetailRow.components[index];
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(view.component);

        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<IDetailsComponent>componentRef.instance).params = view.params;
        (<IDetailsComponent>componentRef.instance).parentKey = this.DetailRow.rowExpanded;
        (<IDetailsComponent>componentRef.instance).data = this.DetailRow.rowData;
        (<EventEmitter<boolean>>(<any>componentRef.instance).onLoadEnded).subscribe((r: boolean) => {
            this.DetailRow.stopAsync();
        });
        } else {
            this.hasPermission = false;
            setTimeout(() => {
                this.DetailRow.stopAsync();
            })
        }
    }
}