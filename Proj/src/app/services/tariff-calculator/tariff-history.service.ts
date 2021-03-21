import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { LogicDeviceTariffHistory } from './models/logic-device-tariff-history';

@Injectable()
export class TariffHistoryService extends WebService<LogicDeviceTariffHistory> {
  URL = 'tariff-calc/logic-devices';
  idLogicDevice: number;
  idLogicDeviceHistory: string | number;

  getLogicDeviceHistories() {
    return super.get(`${this.idLogicDevice}/tariff-history`);
  }

  getLogicDeviceHistory() {
    return super.get(
      `${this.idLogicDevice}/tariff-history/${this.idLogicDeviceHistory}`
    );
  }

  saveLogicDeviceHistory(history: LogicDeviceTariffHistory) {
    history.IdLogicDevice = this.idLogicDevice;
    return super.post(history, `${this.idLogicDevice}/tariff-history`);
  }

  deleteLogicDeviceHistory(idLogicDeviceHistory: number) {
    return super.delete(
      `${this.idLogicDevice}/tariff-history/${idLogicDeviceHistory}`
    );
  }
}
