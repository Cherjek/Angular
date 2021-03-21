import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit } from '@angular/core';
import { EquipmentService } from 'src/app/services/common/Equipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalValues, Utils } from 'src/app/core';
import { finalize } from 'rxjs/operators';
import { IHierarchyNodeView } from 'src/app/services/additionally-hierarchies';
import { TreeListCheckedService } from 'src/app/shared/rom-forms/treeList.checked.panel';
import { CommandCreateService } from 'src/app/services/commands/command-create.service';
import { CommandType, Parameter } from 'src/app/services/commands/Models/Command';
import { CommandRequest } from 'src/app/services/commands/Models/CommandRequest';

declare var $: any;

@Component({
    selector: 'rom-command-create',
    templateUrl: './command-create.component.html',
    styleUrls: ['./command-create.component.less'],
    providers: [CommandCreateService]
})
export class CommandCreateComponent implements OnInit {

    loadingContentPanel = false;
    loadingRightPanel = true;
    errorsRightPanel: any[] = [];
    errors: any[] = [];
    nodes: IHierarchyNodeView[];
    commandsType: CommandType[];
    basketHeaderMenu: string[];
    changeDetection: string;
    isCreateValidSuccess = false;
    idHierarchy: number;
    jobName: string;
    public expandedRow: any = {
        expandedRowId: null,
        isExpanded: false
    }
    public lastRowReportClick: any;

    constructor(
        private equipmentService: EquipmentService,
        private commandCreateService: CommandCreateService,
        private router: Router,
        private activateRoute: ActivatedRoute,
        public treeListCheckedService: TreeListCheckedService,
        public utilsTree: Utils.UtilsTree
    ) { }

    ngOnInit() {
        this.basketHeaderMenu = [GlobalValues.Instance.hierarchyApp.NodesName, AppLocalization.Label32];
        this.idHierarchy = this.activateRoute.snapshot.params.id;

        this.loadData();
        this.loadCommandsType();
    }

    removeListItems(items: any) {
        if (items.length) {
          this.nodes = this.nodes || [];
          const template = this.getDataSourceClone(this.nodes);
          this.utilsTree.excludeTree(items, template, 'Id', 'LogicDevices');
          this.nodes = template;
          this.changeDetection = (new Date()).getTime().toString();
        } else {
          this.nodes = [];
        }
        if (this.nodes == null || !this.nodes.length) {
            this.back2Objects();
        }
    }

    onRowExpanded(id: string) {

        if (this.expandedRow.expandedRowId != id) this.expandedRow.isExpanded = false;
        this.expandedRow.expandedRowId = id;

        if (!this.expandedRow.isExpanded) {
            this.showReportDetails(id);
        }
        else {
            this.hideReportDetails(id);
            setTimeout(() => this.lastRowReportClick.IsFocused = false, 100);
        }
        this.expandedRow.isExpanded = !this.expandedRow.isExpanded;
    }

    dropParamsValue(params: Parameter[]) {
        params.forEach(p => p['ValueOpt'] = p.Value = null);
    }

    checkParams(params: Parameter[]) {
        return params.some(x => x.Value == null)
    }

    getOptionValue(val: any, vals: any[]) {
        if (val == null) return null;
        return (vals || []).find(x => x.Value == val);
    }

    clickedAddCommand(command: CommandType) {

        this.errors = [];
        this.errorsRightPanel = [];

        if (this.nodes == null || !this.nodes.length) {
            this.errorsRightPanel = [AppLocalization.NoEquipment];
            return;
        }

        const request = new CommandRequest();
        request.IdHierarchy = this.idHierarchy;
        request.Name = this.jobName;
        request.LogicDevices =
            this.nodes
                .map(node => 
                  node.LogicDevices
                )
                .reduce((list1, list2) => [...list1, ...list2])
                .sort((x: any, y: any) => x.Position - y.Position)
                .map((ld: any) => ld.Id);

        request.CommandType = command;

        if (this.errors.length) {
            return;
        }

        this.loadingContentPanel = true;

        this.commandCreateService.setCommandsType(request)
            .then((result: any) => {
                this.router.navigate(['management-module/managements-queue']);
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    private showReportDetails(id: string) {
        $("#" + id).collapse('show');
    }

    private hideReportDetails(id: string) {
        $("#" + id).collapse('hide');
    }

    private getDataSourceClone(data: IHierarchyNodeView[]): IHierarchyNodeView[] {
        return [...data].map(d => {
            const newNode = { ...d };
            newNode.LogicDevices = [...d.LogicDevices];
            return newNode;
        });
    }

    private loadCommandsType() {
        this.loadingContentPanel = true;
        const key = this.activateRoute.snapshot.queryParams.key;
        this.commandCreateService
            .getCommandsType(key)
            .pipe(
                finalize(() => this.loadingContentPanel = false)
            )
            .subscribe(
                (data: CommandType[]) => {
                    this.commandsType = data;
                },
                (error: any) => this.errors = [error]
            );
    }

    private loadData() {
        this.loadingRightPanel = true;
        const key = this.activateRoute.snapshot.queryParams.key;
        this.equipmentService
            .getForRequestModule(this.idHierarchy, key)
            .pipe(
                finalize(() => this.loadingRightPanel = false)
            )
            .subscribe(
                (data: IHierarchyNodeView[]) => {
                    this.nodes = data;
                },
                (error: any) => this.errorsRightPanel = [error]
            );
    }

    private back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }
}
