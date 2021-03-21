import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ListView } from '../../../../../controls/ListView/ListView';

@Component({
  selector: 'rom-data-query-type-channels',
  templateUrl: './data-query-type-channels.component.html',
  styleUrls: ['./data-query-type-channels.component.less']
})
export class DataQueryTypeChannelsComponent implements OnInit {

    public typesPipeTrigger: Date;
    public tagsPipeTrigger: Date;

    public isTypesListChange: boolean;

    public editMode = false;

    @Input() access: string;
    @Input() typeTags: any[];
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<any>();
    @ViewChild('ldTypesLV', { static: true }) public ldTypesLV: ListView;
    @ViewChild('ldTypeTagsLV', { static: true }) public ldTypeTagsLV: ListView;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    private resizeLVS(offset: number) {
        this.ldTypesLV.OffsetBottom = offset;
        this.ldTypeTagsLV.OffsetBottom = offset;
        setTimeout(() => {
            this.ldTypesLV.resizeVirtualScroll();
            this.ldTypeTagsLV.resizeVirtualScroll();
        }, 300);
    }

    public changeListTypeTags() {
        this.editMode = true;
        this.resizeLVS(50);
    }

    public saveTypeTagsChanges() {
        this.resizeLVS(0);

        this.save.emit(this.typeTags);
        this.isTypesListChange = this.editMode = false;
    }

    public cancelTypeTagsChanges() {
        this.resizeLVS(0);
        this.cancel.emit();
        
        this.isTypesListChange = this.editMode = false;
    }

    public addTypes(types: any[]) {
        types.forEach((type: any) => {
            type.IsActive = true;
        });
        this.typesPipeTrigger = new Date();
        this.isTypesListChange = true;
    }

    public deleteType(type: any, event: Event) {
        type.Data.IsActive = false;
        if (type.Data.Channels != null) {
            type.Data.Channels.forEach((x: any) => x.IsActive = false);
        }

        this.typesPipeTrigger = new Date();
        this.isTypesListChange = true;

        event.stopPropagation();
    }

    public onTypeClick(event: any) {
        this.tagsPipeTrigger = new Date();
    }

    public addTypeTags(tags: any) {
        tags.forEach((tag: any) => {
            tag.IsActive = true;
        });
        this.tagsPipeTrigger = new Date();
        this.isTypesListChange = true;
    }

    public deleteTypeTag(tag: any) {
        tag.Data.IsActive = false;

        this.tagsPipeTrigger = new Date();
        this.isTypesListChange = true;
    }

    public onRemoveTypeTags(tags: any[]) {
        tags.forEach((tag: any) => {
            tag.IsActive = false;
        });
        this.tagsPipeTrigger = new Date();
    }

    public onAllCheckClick(event: any) {
        if (event == null) {
            this.isTypesListChange = true;
        }
    }

}
