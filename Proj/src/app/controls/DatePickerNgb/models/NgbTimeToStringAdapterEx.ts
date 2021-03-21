/** Outer dependencies */
import { Injectable } from '@angular/core';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

@Injectable()
export class NgbTimeToStringAdapter extends NgbTimeAdapter<Date> {

    private year: number = new Date().getUTCFullYear();
    private month: number = new Date().getUTCMonth() + 1;
    private day: number = new Date().getUTCDate();

  /**
   * Converts user-model date into an NgbTimeStruct for internal use in the library
   */
  public fromModel(date: Date): NgbTimeStruct {
      if (date == null || (date != null && date.toString() === "Invalid Date")) {
          return null;
      }

      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();

      return { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
  }

  /**
   * Converts internal time value NgbTimeStruct to user-model date
   * The returned type is supposed to be of the same type as fromModel() input-value param
   */
    public toModel(time: NgbTimeStruct): Date {
        if (time && isInteger(time.hour) && isInteger(time.minute) && isInteger(time.second)) {
            const year = this.year.toString().padStart(2, '0');
            const month = this.month.toString().padStart(2, '0');
            const day = this.day.toString().padStart(2, '0');

            const hour = time.hour.toString().padStart(2, '0');
            const minute = time.minute.toString().padStart(2, '0');
            const second = time.second.toString().padStart(2, '0');

            //const timeZone = Math.abs((new Date().getTimezoneOffset() / 60)).toString().padStart(2, '0');
            //return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+${timeZone}:00`);
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
        }

        return null;
    }
}