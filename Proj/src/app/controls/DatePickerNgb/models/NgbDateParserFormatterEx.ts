import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructEx } from './NgbDateStructEx';
import { Utils } from "../../../core";

export class NgbDateParserFormatterEx extends NgbDateParserFormatter {

    dateGlobal: string | Date;

    parse(value: string): NgbDateStructEx {
        if (value == null) {
            return null;
        }

        const struct = new NgbDateStructEx();
        const date = Utils.DateFormat.Instance.getDateTimeFromStr(value);
        if (date == null || date.toString() === 'Invalid Date') {
            return null;
        }

        struct.year = date.getFullYear();
        struct.month = date.getMonth() + 1;
        struct.day = date.getDate();

        struct.hour = date.getHours();
        struct.minute = date.getMinutes();
        if (this.dateGlobal != null) {
            if (typeof this.dateGlobal !== 'string') {
                this.dateGlobal = new Date(this.dateGlobal.setHours(struct.hour));
                this.dateGlobal = new Date(this.dateGlobal.setMinutes(struct.minute));
            } else {
                const dateGlobal = Utils.DateFormat.Instance.getDateTimeFromStr(this.dateGlobal);
                if (dateGlobal == null || dateGlobal.toString() === 'Invalid Date') {
                    this.dateGlobal = null;
                }
            }
        }

        return struct;
    }

    format(date: NgbDateStructEx): string {
        if (date == null) {
            return null;
        }
        else {
            let hour = 0;
            let minute = 0;
            let second = 0;

            if (this.dateGlobal != null && typeof this.dateGlobal !== 'string') {
                hour = this.dateGlobal.getHours();
                minute = this.dateGlobal.getMinutes();
                second = this.dateGlobal.getSeconds();
            }

            const dateParse = new Date(date.year, date.month - 1, date.day, hour, minute, second);
            return Utils.DateFormat.Instance.getDateTime(dateParse);
        }
    }
}