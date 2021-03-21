import { Injectable } from "@angular/core";

export const storage = "DataResultSettingsServiceStorage";

@Injectable()
export class DataResultSettingsService {

    storageKey = storage;

    setSettings(settings: any) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }

    getSettings() {

        let getDate = (date: any) => {
            if (date) {
                date = new Date(date);
            }
            return date;
        }

        let settings = JSON.parse(localStorage.getItem(this.storageKey));

        if (settings.fromDate) settings.fromDate = getDate(settings.fromDate);
        if (settings.toDate) settings.toDate = getDate(settings.toDate);

        return settings;
    }
    
}

@Injectable()
export class DataResultCompareSettingsService extends DataResultSettingsService {

    storageKey = `${storage}.Compare`;

    removeSettings() {
        localStorage.removeItem(this.storageKey);
    }
}