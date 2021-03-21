import { Injectable } from '@angular/core';
import { WebService } from '../../common/Data.service';
import { LogicTagTypeView, TagTypeView,
         DeviceInfoView, TagScriptView,
         DeviceTagTypeView, TagThresholdView } from '../Models/tags.editor/_tagsEditorModels';
import { Observable, Observer, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TagsEditorService extends WebService<any> {
    readonly URL = 'tagsEditor';
    readonly containers: any = {};

    cachedTagTypes: TagTypeView[];

    getLogicTagTypes(idLogicDevice: number): Observable<LogicTagTypeView[]> {
        return super.get(`logicTagTypes/${idLogicDevice}`);
    }

    getTagTypes(): Observable<TagTypeView[]> {
        const url = `tagTypes`;

        if (this.cachedTagTypes != null) {
            return of(this.cachedTagTypes);
        } else {
            return this.getComplete(url)
                .pipe(
                    map(data => this.cachedTagTypes = data as TagTypeView[])
                );
        }
    }

    getDevices(idLogicDevice: number): Observable<DeviceInfoView[]> {
        const url = `devices/${idLogicDevice}`;

        return this.getComplete(url);
    }

    getScripts(): Observable<TagScriptView[]> {
        const url = `scripts`;

        return this.getComplete(url);
    }

    getDeviceTagTypes(idDeviceType: number): Observable<DeviceTagTypeView[]> {
        const url = `deviceTagTypes/${idDeviceType}`;

        return this.getComplete(url);
    }

    getScriptOutVariables(outVariables: any[]) {
        return Observable.create((observer: Observer<any[]>) => {
            observer.next(outVariables);
            observer.complete();
        });
    }

    getTagThresholds(idLogicDevice: number, idLogicTagType: number): Observable<TagThresholdView[]> {
        const url = `tagThresholds/${idLogicDevice}`;

        return Observable.create((observer: Observer<any[]>) => {
            this.getComplete(url)
                .subscribe((data: TagThresholdView[]) => {
                    observer.next(data.filter((thr: TagThresholdView) => thr.IdLogicTagType === idLogicTagType));
                    observer.complete();
                }
            );
        });
    }

    getComplete(url: string) {
        return Observable.create((observer: Observer<any[]>) => {

            if (this.containers[url] == null) {
                super.get(url)
                    .subscribe((data: any[]) => {
                            this.containers[url] = data;
                            observer.next(data);
                            observer.complete();
                        }
                    );
            } else {
                observer.next(this.containers[url]);
                observer.complete();
            }
        });
    }
}
