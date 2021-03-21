import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';

export module Common {

    @Injectable()
    export class Localization {

        public static Calendar: any = {
            Month: {
                January: "Январь",
                February: "Февраль",
                March: "Март",
                April: "Апрель",
                May: "Май",
                June: "Июнь",
                July: "Июль",
                August: "Август",
                September: "Сентябрь",
                October: "Октябрь",
                November: "Ноябрь",
                December: "Декабрь"
            },
            DayWeeks: {
                Monday: "Понедельник",
                Tuesday: "Вторник",
                Wednesday: "Среда",
                Thursday: "Четверг",
                Friday: "Пятница",
                Saturday: "Суббота",
                Sunday: "Воскресенье"
            },
            DayWeeksShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            DayWeeksShortAlt: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        }

        public static Form: any = {
            ErrorObjectsCount: AppLocalization.Label50,
            ReportErrorName: AppLocalization.Label47,

            Search: AppLocalization.Search
        }
    }
}