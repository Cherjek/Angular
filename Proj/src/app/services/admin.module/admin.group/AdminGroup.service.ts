import { Injectable } from "@angular/core";
import { WebService } from "../../common/Data.service";
import { map } from 'rxjs/operators';

@Injectable()
export class AdminGroupService extends WebService<any> {
    URL: string = "admin/group";
    getUsers(groupId: any) {
        return super.get(`${groupId}/users`);
    }

    getGroup(id: string | number) {
        return super.get(id).pipe(map(group => {
            group.StartPage = this.appConfig.getConfig('groupPages')
                .find((x: any) => x.Code === group.StartPage);
            return group;
        }));
    }

    postGroup(group: any) {
        group.StartPage = (group.StartPage || {} as any).Code || null;
        return super.post(group);
    }

    getTypesAndTags(groupId: any) {
        return super.get(`${groupId}/typeLogicDevices`);
    }
    postTypesAndTags(groupId: any, data: any) {
        return super.post(data, `${groupId}/typeLogicDevices`);
    }

    getDefaultReportPermissions(groupId: any) {
        return super.get(`${groupId}/defReportPermissions`);
    }
    getScheduleReportPermissions(groupId: any) {
        return super.get(`${groupId}/scheduleReportPermissions`);
    }
    postDefaultReportPermissions(groupId: any, data: any) {
        return super.post(data, `${groupId}/defReportPermissions`);
    }
    postScheduleReportPermissions(groupId: any, data: any) {
        return super.post(data, `${groupId}/scheduleReportPermissions`);
    }

    getModulePermissions(groupId: any) {
        return super.get(`${groupId}/permissions`);
    }
    postModulePermissions(groupId: any, data: any) {
        return super.post(data, `${groupId}/permissions`);
    }

    getSubscribers(groupId: any) {
        return super.get(`${groupId}/logicDevicesPermissions`);
    }
    postSubscribers(groupId: any, esos: any[]) {
        return super.post(esos, `${groupId}/logicDevicesPermissions`);
    }
    getAllSubscrsAllUnits(groupId: any, filterKey?: string) {
        return super.get( filterKey ? `units/${groupId}/${filterKey}` : `units/${groupId}`);
    }

    getHierarchies(groupId: number) {
        return super.get(`${groupId}/hierarchy`);
    }
    postHierarchies(groupId: any, data: any) {
        return super.post(data, `${groupId}/hierarchy`);
    }

    getSubsystems(groupId: number) {
        return super.get(`${groupId}/sub-systems`);
    }
    postSubsystems(groupId: any, data: any) {
        return super.post(data, `${groupId}/sub-systems`);
    }
}