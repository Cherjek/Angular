import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { RequestsQueueRoutingModule } from './requests-queue-routing.module';
import { RequestsQueueComponent } from './components/requests-queue/requests-queue.component';
import { RequestsQueueService } from 'src/app/services/requests.module/RequestsQueue.service';


@NgModule({
  declarations: [RequestsQueueComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    RequestsQueueRoutingModule
  ],
  providers: [RequestsQueueService]
})
export class RequestsQueueModule {}
