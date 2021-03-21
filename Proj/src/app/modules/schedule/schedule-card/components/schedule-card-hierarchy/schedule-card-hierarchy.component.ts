import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IScheduleHierarchyNodes, ScheduleCardService } from 'src/app/services/schedules.module';
import { finalize } from 'rxjs/operators';
import { Hierarchy } from 'src/app/services/additionally-hierarchies';
import { DataGrid } from 'src/app/controls/DataGrid';

@Component({
    selector: 'rom-schedule-card-hierarchy',
    templateUrl: './schedule-card-hierarchy.component.html',
    styleUrls: ['./schedule-card-hierarchy.component.css'],
    providers: [ScheduleCardService]
})
export class ScheduleCardHierarchyComponent implements OnInit {

    idSchedule: number;
    scheduleHierarchy: IScheduleHierarchyNodes;
    loadingContentPanel = true;
    errorsContentForm: any[] = [];

    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;
    
    constructor(
        private scheduleCardService: ScheduleCardService,
        private activedRoute: ActivatedRoute,
        private router: Router) { }

    ngOnInit() { 
        this.idSchedule = this.activedRoute.parent.snapshot.params.id;

        this.loadScheduleHierarchies();
    }

    changeHierarchies() {
        this.router.navigate([`schedule-module/schedule-hierarchies-edit/${this.idSchedule}`]);
    }

    private loadScheduleHierarchies() {
        this.scheduleCardService
            .getScheduleHierarchyNodes(this.idSchedule)
            .pipe(
                finalize(() => this.loadingContentPanel = false)
            )
            .subscribe(
                (data: IScheduleHierarchyNodes) => {
                    this.scheduleHierarchy = data;
                },
                (error) => {
                    this.errorsContentForm.push(error);
                });
    }
}
