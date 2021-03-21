import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExportToXlsx {

    constructor() { }

    private fileName = "excel_data";

    public exportAsExcelFile(json: any[], exportXlsxOptions?: ExportXlsxOptions): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json/*, { cellDates: true, dateNF: Constants.Common.Constants.DATE_TIME_FMT }*/);

        if (exportXlsxOptions != null) {
            this.fileName = exportXlsxOptions.fileName;

            if (exportXlsxOptions.exportColsInfo != null) {

                exportXlsxOptions.exportColsInfo.forEach((col: ExportColInfo) => {

                    if (!worksheet['!cols']) worksheet['!cols'] = [];
                    worksheet['!cols'].push({ wpx: col.wpx });

                    if (col.isOptionsSet()) {
                        for (let i = 2; i <= json.length + 1; i++) {
                            let cell = (<XLSX.CellObject>worksheet[col.name + i]);
                            if (col.type) cell.t = col.type;
                            if (col.z) cell.z = col.z;
                            if (col.style) cell.s = col.style;
                        }
                    }
                    
                });

                /*worksheet['!cols'] = [{ wpx: 250 }, { wpx: 350 }];
                (<XLSX.CellObject>worksheet.C2).t = 'd';
                (<XLSX.CellObject>worksheet.C2).z = Constants.Common.Constants.DATE_TIME_FMT;

                (<XLSX.CellObject>worksheet.D2).t = 'n';
                (<XLSX.CellObject>worksheet.D2).z = '#,###0.000';*/
            }
        }
        //const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        //this.saveAsExcelFile(excelBuffer, excelFileName);
        /* generate workbook and add the worksheet */

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, AppLocalization.LeafExport);

        /* save to file */
        XLSX.writeFile(wb, this.fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}

export class ExportXlsxOptions {
    fileName: string;

    private _exportColsInfo: ExportColInfo[];
    get exportColsInfo(): ExportColInfo[] {
        return this._exportColsInfo;
    }
    set exportColsInfo(items: ExportColInfo[]) {
        if (items) {
            this._exportColsInfo = [];
            items.forEach((item: ExportColInfo) => {
                this._exportColsInfo.push(Object.assign(new ExportColInfo(), item));
            });
        }
    }
}

export class ExportColInfo {
    name: string;//A,B,C,D,E..... field Excel
    /** width in screen pixels */
    wpx?: number = 150;

    type?: any;//d - date, n - number... def - string
    z?: string;//specific format - example: date "YYY-MM-DD hh:mm"
    style?: any;

    isOptionsSet?: any = () => {
        return (this.type != null || this.z != null || this.style != null);
    }
}