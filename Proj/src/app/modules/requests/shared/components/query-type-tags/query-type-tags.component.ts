import { Component, OnInit, Input } from '@angular/core';
import { IQueryTypeTags, ILogicDeviceTagTypeInfo } from 'src/app/services/data-query';

@Component({
    selector: 'rom-query-type-tags',
    templateUrl: './query-type-tags.component.html',
    styleUrls: ['./query-type-tags.component.less']
})
export class QueryTypeTagsComponent implements OnInit {

    private _queryTypeTags: IQueryTypeTags[];
    @Input() 
    get queryTypeTags(): IQueryTypeTags[] {
        return this._queryTypeTags;
    }
    set queryTypeTags(val: IQueryTypeTags[]) {
        this.formEditItems = {};
        val.forEach(d => {
                        this.formEditItems[d.QueryType.Id] = {
                            edit: false
                        };
                    });
        this._queryTypeTags = val;
    }
    formEditItems: any;

    constructor() { }

    ngOnInit() {
    }

    saveTags(id: number, isAllSelect: boolean, itemsSelect: ILogicDeviceTagTypeInfo[]) {
        const query = this.formEditItems[id];
        query.tags = itemsSelect;
        query.edit = false;
    }

    removeTag(tag: ILogicDeviceTagTypeInfo, id: number) {
        const query = this.formEditItems[id];
        const index = (query.tags || []).findIndex((t: ILogicDeviceTagTypeInfo) => t.Id === tag.Id);
        (query.tags || []).splice(index, 1);
    }

    updateList(item: IQueryTypeTags) {

        const query = this.formEditItems[item.QueryType.Id];

        // drop checked
        item.TagCodes.forEach(tag => delete tag['IsCheck']);

        let itemsCkecked;
        if (item.AllTagCodes) {
            itemsCkecked = item.TagCodes;
        } else {
            if (query.tags != null) {
                itemsCkecked = item.TagCodes
                    .filter(tc => (query.tags as Array<ILogicDeviceTagTypeInfo>).find(qtc => qtc.Id === tc.Id) != null);
            }
        }
        (itemsCkecked || []).forEach(tag => tag['IsCheck'] = true);
        query.edit = true;
    }
}
