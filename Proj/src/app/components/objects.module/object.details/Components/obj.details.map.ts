import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ObjectInjectService } from '../../objects/object.service';

import * as ConstNamespace from '../../../../common/Constants';
import Constants = ConstNamespace.Common.Constants;

declare var ymaps: any;
declare var $: any;

@Component({
    selector: 'obj-map',
    template: `
    <div id="map" style="height: 300px; width: 100%; position: relative;">
       <loader-ro5 [(loading)]="loadingPanel"></loader-ro5>
       <message-popup [messages]="errors"></message-popup>
    </div>     
  `
})
export class ObjDetailsMap implements OnInit, OnDestroy {

    @Input() Parent: any;
    @Input() Key: any;

    private intervalTimer: any;
    public errors: any[] = [];
    public loadingPanel = true;

    constructor(private objInjectService: ObjectInjectService) { }

    ngOnInit() {
        let elem = document.getElementById("yaMaps");
        if (elem) {
            elem.parentNode.removeChild(elem);
        }

        this.objInjectService.map.get(this.Parent[this.Key]).subscribe(res => {

                let x: number = (res || {})['Lat'] || Constants.MAP_CENTER_DEFAULT.LAT;
                let y: number = (res || {})['Lon'] || Constants.MAP_CENTER_DEFAULT.LON;

                loadScript(null, null, 
                    `function initMap() { 
                        let yaMapApi = new ymaps.Map('map', { center: [${x}, ${y}], zoom: 19 }); 
                    
                        let placemark = new ymaps.Placemark([${x}, ${y}], {
                            balloonContent: '${AppLocalization.Location}'
                        });

                        yaMapApi.geoObjects.add(placemark);
                        yaMapApi.controls.remove('searchControl');
                        yaMapApi.controls.remove('geolocation');
                        yaMapApi.controls.add(new ymaps.control.ZoomControl());
                    }`);
                loadScript("yaMaps", "http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU&onload=initMap", null);

                setTimeout(() => this.loadingPanel = false, 400);
            },
            (error) => {
                this.errors.push(error);
                this.loadingPanel = false;
            });
    }

    ngOnDestroy() {
        let elem = document.getElementById("yaMaps");
        elem.parentNode.removeChild(elem);
    }
}

function loadScript(id: string, url: string, innerHTML: string) {

    var script = document.createElement("script")
    script.type = "text/javascript";
    script.id = id;

    if (url)
        script.src = url;
    else
        script.innerHTML = innerHTML;

    document.getElementsByTagName("head")[0].appendChild(script);
}

