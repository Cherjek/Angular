import { Injectable } from "@angular/core";
import { WebService } from "./Data.service";

export enum EntityType { Unit, LogicDevice, Device }

@Injectable({
    providedIn: 'root'
})
export class PropertiesService extends WebService<any> {
    URL: string = "common/properties";

    getProperties(id: any, type: EntityType) {
        if (type == EntityType.Unit) {
            return super.get(`${id}/0`);
        } else if (type == EntityType.LogicDevice) {
            return super.get(`${id}/1`);
        } else if (type == EntityType.Device) {
            return super.get(`${id}/2`);
        }
    }
}