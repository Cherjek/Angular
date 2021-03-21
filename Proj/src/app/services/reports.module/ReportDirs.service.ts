import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";
import { ServiceJob } from "../common/Models/ServiceJob";

@Injectable()
export class ReportDirsService extends WebService<ServiceJob> {
    URL: string = "reports/groups";

    addToFavorites(reportId: number) {
        return super.post(null, `favorites/${reportId}`);
    }

    deleteFromFavorites(reportId: number) {
        return super.delete(reportId, 'favorites');
    }
}