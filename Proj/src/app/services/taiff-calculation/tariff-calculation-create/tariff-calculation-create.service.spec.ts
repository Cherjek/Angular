/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TariffCalculationCreateService } from './tariff-calculation-create.service';

describe('Service: TariffCalculationCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TariffCalculationCreateService]
    });
  });

  it('should ...', inject([TariffCalculationCreateService], (service: TariffCalculationCreateService) => {
    expect(service).toBeTruthy();
  }));
});
