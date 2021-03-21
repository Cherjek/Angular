import { ExportTaskParameters } from './Models/ExportTaskParameters';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/index';
import { map, delay } from 'rxjs/operators';
import { WebService } from '../../common/Data.service';
import { DatabaseTaskLogRecord } from '../../data-query';
import { ExportImportSettingType } from './Models/ExportImportSettingType';
import { ImportTaskParameters } from './Models/ImportTaskParameters';
import { ExportTaskParametersTemplate } from './Models/ExportTaskParametersTemplate';
import { ImportTaskParametersTemplate } from './Models/ImportTaskParametersTemplate';
import { HttpParams } from '@angular/common/http';
import { ImportExportTask } from './Models/ImportExportTask';
import { ImportExportResult } from './Models/ImportExportResult';

@Injectable({
  providedIn: 'root',
})
export class ExportImportService extends WebService<
  DatabaseTaskLogRecord | 
  ExportImportSettingType[] |
  ImportExportTask
  > {
  URL = 'tariff-calc/export-import';

  getTask(idTask: number) {
    return super.get(`tasks/${idTask}`) as Observable<
      ImportExportTask | ImportExportResult
    >;
  }
  
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
    return super.get('export-settings') as Observable<ExportImportSettingType[]>;
  }

  getImportSettings() {
    return super.get('import-settings') as Observable<ExportImportSettingType[]>;
  }

  saveImport(data: ImportTaskParameters) {
    return super.post(data as any, 'import-start')
  }

  saveImportWithFiles(data: any) {
    const params = data.parameters as ImportTaskParameters;
    const files = data.files as File[];
    const formData: FormData = new FormData();
    (files || []).forEach(file => {
      formData.append("files", file, file.name);
    });
    formData.append("name", params.Name);
    return super.postFormData(formData, 'import-start/files')
  }

  saveExport(data: ExportTaskParameters) {
    return super.post(data as any, 'export-start')
  }

  saveTemplate(data: ImportTaskParametersTemplate | ExportTaskParametersTemplate) {
    if ((data.Parameters as any) instanceof ExportTaskParameters) {
      return super.post(data as any, 'export-create-template')
    } else {
      return super.post(data as any, 'import-create-template')
    }
  }

  getImportTemplates() {
    return super.get('imports-template');
  }

  getExportTemplates() {
    return super.get('exports-template');
  }

  getTemplate(id: number, typeForm: string) {
    return super.get(`${typeForm === 'import' ? 'import-template' : 'export-template'}/${id}`)
  }

  deleteTemplate(importExportType: number, id: number) {
    return super.delete(id, importExportType === 1 ? 'export-template' : 'import-template')
  }

  getImportFiles(files: string[]) {
    let params = new HttpParams();
    for (let file of files) {
      params = params.append('files', file); 
    }    
    return super.loadBinaryData('import/files', params);
  }
}
