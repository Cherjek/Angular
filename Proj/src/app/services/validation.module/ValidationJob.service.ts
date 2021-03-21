import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { ServiceJob } from "../common/Models/ServiceJob";

@Injectable()
export class ValidationJobService extends WebService<ServiceJob> {
    URL: string = "validation/queue";

    repeatAnalyze(id: any) {
        return this.post(null, '/action/repeat/' + id);
    }

    repeatAnalyzeError(id: any) {
        return this.post(null, '/action/repeat/error/' + id);
    }

    cancelAnalyze(id: any) {
        return this.post(null, '/action/cancel/' + id);
    }
}