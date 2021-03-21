import { WebService } from './../../../common/Data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseTaskLogRecord } from 'src/app/services/data-query';
import { ExportImportSettingType } from 'src/app/services/taiff-calculation/export-import-queue/Models/ExportImportSettingType';

@Injectable()
export class TariffCalculatorMainFilterService extends WebService<any> {
  URL = 'tariff-calc/main';

  getTaskLog(idTask: any): Observable<DatabaseTaskLogRecord[]> {
    return super
      .get(`tasks/${idTask}/log`)
      .pipe(
        map((logs: any[]) =>
          logs.map((log) => Object.assign(new DatabaseTaskLogRecord(), log))
        )
      );
  }

  abortTask(idTask: any) {
    return super.post(null, `tasks/${idTask}/abort`);
  }

  repeatTask(idTask: any) {
    return super.post(null, `tasks/${idTask}/repeat`);
  }

  getExportSettings() {
    return super.get('export-settings') as Observable<
      ExportImportSettingType[]
    >;
  }

  getImportSettings() {
    return super.get('import-settings') as Observable<
      ExportImportSettingType[]
    >;
  }
}
