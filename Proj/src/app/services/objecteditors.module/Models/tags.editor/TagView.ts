import { SubSystem } from 'src/app/services/references/models/SubSystem';
import { LogicTagTypeView, TagTypeView, DeviceInfoView, DeviceTagTypeView, TagScriptView, TagScriptVariableView, TagThresholdView } from './_tagsEditorModels';
import { TagValueFilter } from './TagValueFilter';

export class TagView {
    constructor(
        public LogicTagType?: LogicTagTypeView,

        public Id?: number,
        public LogicDevice?: any,
        public TagType?: TagTypeView,
        public Device?: DeviceInfoView,
        public DeviceTagType?: DeviceTagTypeView,
        public Script?: TagScriptView,
        public ScriptVariable?: TagScriptVariableView,
        public Threshold?: TagThresholdView,
        public TagValueFilter?: TagValueFilter,
        public SubSystem?: SubSystem
        ) { }
}