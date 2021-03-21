import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructEx } from './NgbDateStructEx';

function isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function isString(value: any): value is string {
    return typeof value === 'string';
}

export class NgbDateAdapterEx extends NgbDateAdapter<Date> {

    dateFormatter: any;

    fromModel(date: string | Date): NgbDateStructEx {
        if (date == null) {
            return null;
        }

        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (date.toString() === 'Invalid Date') {
            return null;
        }

        let hour = 0;
        let minute = 0;
        let second = 0;

        if (this.dateFormatter != null && this.dateFormatter.dateGlobal != null) {
            hour = this.dateFormatter.dateGlobal.getHours();
            minute = this.dateFormatter.dateGlobal.getMinutes();
            second = this.dateFormatter.dateGlobal.getSeconds();
        }

        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: hour, minute: minute };
    }
    toModel(date: NgbDateStructEx): Date {
        if (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) {
            const year = date.year.toString().padStart(2, '0');
            const month = date.month.toString().padStart(2, '0');
            const day = date.day.toString().padStart(2, '0');

            let hour = 0;
            let minute = 0;
            let second = 0;

            if (this.dateFormatter != null && this.dateFormatter.dateGlobal != null) {
                hour = this.dateFormatter.dateGlobal.getHours();
                minute = this.dateFormatter.dateGlobal.getMinutes();
                second = this.dateFormatter.dateGlobal.getSeconds();
            }

            //const timeZone = Math.abs((new Date().getTimezoneOffset() / 60)).toString().padStart(2, '0');
            //return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+${timeZone}:00`);
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour, minute);
        }
        return null;
    }

}