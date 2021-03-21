import { IDeviceChannelTypeView } from './DeviceChannelTypeView';
import { IData, Data } from './Data';

export interface IDataQueryTypeChannelsView extends IData {
    IsActive: boolean;
    Channels: IDeviceChannelTypeView[];
}

export class DataQueryTypeChannelsView extends Data implements IDataQueryTypeChannelsView {
    IsActive: boolean;
    Channels: IDeviceChannelTypeView[];
}