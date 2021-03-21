import { Tag } from '../../common/Models/Tag';
export class ViewTagsSettings {

    constructor(public tags: Tag[],
        public fromDate?: any,
        public toDate?: any) {
    }
}