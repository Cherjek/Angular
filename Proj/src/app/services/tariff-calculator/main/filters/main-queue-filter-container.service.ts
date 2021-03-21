import { Injectable } from '@angular/core';
import { TariffCalculatorMainAddService } from './tariff-calculator-main-add.service';
import { TariffCalculatorMainService } from './tariff-calculator-main.service';

@Injectable()
export class MainQueueFilterContainerService {
  filtersTemplateService: any;
  constructor(
    public filtersService: TariffCalculatorMainService,
    public filtersNewService: TariffCalculatorMainAddService
  ) {}
}
