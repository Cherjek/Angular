import { Injectable } from '@angular/core';
import { WebService } from "../common/Data.service";

@Injectable()
export class ReportQueueService extends WebService<any> {
    URL: string = "reports/queue";

    repeatAnalyze(id: any) {
        return this.post(null, '/action/repeat/' + id);
    }

    cancelAnalyze(id: any) {
        return this.post(null, '/action/cancel/' + id);
    }
}
