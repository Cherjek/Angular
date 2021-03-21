import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { Observable, Observer, of, forkJoin } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { EventLogRecord } from '../Models/EventLogRecord';
import { HierarchyMainStatesService } from '../../hierarchy-main/hierarchy-main-states.service';
import { EventLog } from '../Models/EventLog';

type LogicDevice = { Id: number };
type EventLogRecordData = EventLogRecord & { DateStart: string | Date, DateEnd: string | Date, LogicDevice: LogicDevice };

@Injectable()
export class JournalsDefFiltersService extends WebService<any> {
    URL = 'journals/events';
    
    upload(filter: any): Promise<Object> {
        return super.post(filter, `upload`);
    }

    getDefault(): Observable<any> {
        return of([]);
    }

    getRecords(hierarchyMainStatesService: HierarchyMainStatesService, key?: string): Observable<EventLogRecord[]> {
        let url = ``;
        if (key != null) {
            url += `/${key}`;
        }
        return new Observable(obs => {
          forkJoin([hierarchyMainStatesService.getSubSystems(), hierarchyMainStatesService.getStateType()])
            .subscribe((result: any[]) => {
              const subSystem = result[0];
              const states = result[1];
              super.get(url)
                .subscribe(
                    (eventLog: EventLog) => {
                      if (eventLog == null || eventLog.Events == null || !eventLog.Events.length) {
                        obs.next([]);
                        obs.complete();
                        return;
                      }
                      let mapLD = {};
                      let mapTag = {};
                      let mapUser = {};
                      let mapSubsytem = {};
                      let mapStates = {};
                      const results = eventLog.Events.map(eventLogRecord => {
                        const _eventLogRecord = <EventLogRecordData>eventLogRecord;
                        const IdLogicDevice = _eventLogRecord.IdLogicDevice as number;
                        if (!mapLD[`${_eventLogRecord.IdLogicDevice}`]) {
                          mapLD[`${_eventLogRecord.IdLogicDevice}`] = eventLog.LogicDevices.find(x => x.Id === _eventLogRecord.IdLogicDevice);
                        }
                        if (!mapTag[`${_eventLogRecord.IdTag}`]) {
                          mapTag[`${_eventLogRecord.IdTag}`] = eventLog.Tags.find(x => x.Id === _eventLogRecord.IdTag);
                        }
                        if (!mapUser[`${_eventLogRecord.IdUserAcknowledge}`]) {
                          mapUser[`${_eventLogRecord.IdUserAcknowledge}`] = eventLog.Users.find(x => x.Id === _eventLogRecord.IdUserAcknowledge);
                        }
                        if (!mapSubsytem[`${_eventLogRecord.IdSubSystem}`]) {
                          mapSubsytem[`${_eventLogRecord.IdSubSystem}`] = subSystem.find((x: any) => x.Id === _eventLogRecord.IdSubSystem);
                        }
                        if (!mapStates[`${_eventLogRecord.IdStateType}`]) {
                          mapStates[`${_eventLogRecord.IdStateType}`] = states.find((x: any) => x.Id === _eventLogRecord.IdStateType);
                        }
                        _eventLogRecord.IdLogicDevice = mapLD[`${_eventLogRecord.IdLogicDevice}`];
                        _eventLogRecord.IdTag = mapTag[`${_eventLogRecord.IdTag}`];
                        _eventLogRecord.IdUserAcknowledge = mapUser[`${_eventLogRecord.IdUserAcknowledge}`];
                        _eventLogRecord.IdSubSystem = mapSubsytem[`${_eventLogRecord.IdSubSystem}`];
                        _eventLogRecord.IdStateType = mapStates[`${_eventLogRecord.IdStateType}`];
                        _eventLogRecord.Acknowledged = _eventLogRecord.Acknowledged ? AppLocalization.Yes : AppLocalization.No;

                        // for detail row
                        if (_eventLogRecord.Datetime) {
                          _eventLogRecord.DateStart = new Date(_eventLogRecord.Datetime);
                          const dateEnd = new Date(_eventLogRecord.Datetime);
                          _eventLogRecord.DateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 30));
                        }
                        _eventLogRecord.LogicDevice = { Id: IdLogicDevice as number };

                        return _eventLogRecord;
                      });
                      obs.next(results as any[]);
                      obs.complete();
                    }
                );
            }, error => obs.error(error))
        });
    }

    acknowledgesEvent(ids: number[]) {
      return super.post(ids, 'acknowledges')
    }
}
