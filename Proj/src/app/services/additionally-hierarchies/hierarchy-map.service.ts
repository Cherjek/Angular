import { AppLocalization } from 'src/app/common/LocaleRes';
import { ColorStatePipe } from './../../modules/hierarchy-main/components/hierarchy-main/pipes/color-state.pipe';
import { MapSubSystem } from './Models/SubSystem';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HierarchyLogicDeviceNodeView } from '.';
import { MapPointData, MapDataStateValueExtra } from './Models/MapPointData';
import { HierarchyMapRomService } from './hierarchy-map-rom.service';
import { PropertiesService, EntityType } from '../common/Properties.service';
import { HierarchyLogicDeviceView } from './Models/HierarchyLogicDeviceView';
import { MapDataStateValue } from './Models/MapDataStateValue';
import { MapStateType } from './Models/MapStateType';

@Injectable({
  providedIn: 'root',
})
export class HierarchyMapService {
  private map: any;
  private map$ = new BehaviorSubject<any>(null);
  private apiURL = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
  private zoom = 9;
  private activeTab: HTMLElement;
  private currentParent: any;
  private logicDevicesListCache = { props: {}, subSys: {} };
  private colorStatePipe: ColorStatePipe;
  private nodeColorsDefault: string[];
  private prevFilter = {};
  mapContainer = '';
  searchBox: string;
  coordinates: number[];
  searchPoints: MapPointData[] = [];
  nodePoints: any[];
  cluster: any;

  constructor(
    private mapService: HierarchyMapRomService,
    private propService: PropertiesService
  ) {
    this.colorStatePipe = new ColorStatePipe();
  }

  getMap() {
    if (this.map) {
      this.map.destroy();
    }
    this.mapInit();
    return this.map$;
  }

  private mapInit() {
    const mapScript = document.createElement('script');
    mapScript.src = this.apiURL;
    document.body.appendChild(mapScript);
    mapScript.onload = () => {
      ymaps.ready(() => {
        const ymap = new ymaps.Map(this.mapContainer, {
          center: this.coordinates,
          zoom: this.zoom,
          controls: ['zoomControl'],
          behaviors: ['default', 'scrollZoom'],
        });
        const nodePoints = this.ballonsInit();
        this.nodePoints = nodePoints;
        this.nodeColorsDefault = this.nodePoints.map(
          (point) => point.options._options.iconColor
        );

        const clusterer = this.initClusterer(nodePoints);
        this.cluster = clusterer;
        this.suggestInit(ymap);

        ymap.geoObjects.add(clusterer);
        this.map = ymap;
        this.map$.next(this.map);
        ymap.setBounds(ymap.geoObjects.getBounds());
      });
    };
  }

  private initClusterer(nodePoints: any[]) {
    const clusterer = new ymaps.Clusterer({
      groupByCoordinates: false,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false,
      clusterIconLayout: 'default#pieChart',
    });
    clusterer.options.set({
      gridSize: 80,
    });
    clusterer.add(nodePoints);
    return clusterer;
  }

  private suggestInit(ymap: any) {
    const suggestView = new ymaps.SuggestView(this.searchBox, {
      provider: {
        suggest: (request: string, options: any) => {
          const nodesFoundBySearch = this.searchPoints.filter((point) =>
            point.text.toLocaleLowerCase().includes(request.toLocaleLowerCase())
          );
          const dropdownResults = [];
          const limit = Math.min(options.results, nodesFoundBySearch.length);
          for (let i = 0; i < limit; i++) {
            const point = nodesFoundBySearch[i];
            dropdownResults.push({
              displayName: point.text,
              coords: point.coords,
              value: point.value,
            });
          }
          return ymaps.vow.resolve(dropdownResults);
        },
      },
      results: 5, // Max number of results to show in dropdown
    });
    suggestView.events.add('select', (e: any) => {
      this.coordinates = e.get('item').coords;
      this.zoom = 15;
      // On Node select, pan to Node
      ymap.panTo(this.coordinates).then(() => {
        ymap.setCenter(this.coordinates, this.zoom);
      });
    });
  }

  /**
   * Create ballons for points in data
   */
  private ballonsInit() {
    const onBallonContentClick = this.initBallonContent();
    const balloonContentLayout = ymaps.templateLayoutFactory.createClass(
      this.constructBallonPopup(),
      {
        // tslint:disable:object-literal-shorthand
        // tslint:disable:space-before-function-paren
        build: function () {
          const point = this.getData().properties._data.point;
          balloonContentLayout.superclass.build.call(this);
          const elements = document.getElementsByClassName(
            'hm-ballon-body__item'
          );
          Array.from(elements).forEach((ele) => {
            ele.addEventListener('click', (e) => {
              onBallonContentClick(e.target, point);
            });
          });
          // Set first tab to open on placemark click
          onBallonContentClick(elements[0].firstChild, point);
        },
        clear: function () {
          const point = this.getData().properties._data.point;
          const elements = document.getElementsByClassName(
            'hm-ballon-body__item'
          );
          Array.from(elements).forEach((ele) => {
            ele.removeEventListener('click', (e) => {
              onBallonContentClick(e.target, point);
            });
          });
          balloonContentLayout.superclass.clear.call(this);
        },
      }
    );
    return this.searchPoints.map((point) => {
      return new ymaps.Placemark(
        point.coords,
        {
          clusterCaption: '<strong>' + point.text + '</strong>',
          balloonContentHeader: point.text,
          balloonContentBody: `<ul>${this.constructBallonBody(
            point.extra
          )}</ul>`,
          point,
        },
        {
          balloonContentLayout,
          balloonPanelMaxMapArea: 0,
          balloonMinWidth: 700,
          iconColor: this.setNodeColor(point.state),
        }
      );
    });
  }

  private setNodeColor(states: MapDataStateValueExtra[]) {
    if (states.length) {
      const highestPriority = states.sort(
        (x, y) => y.stateType.Priority - x.stateType.Priority
      )[0];
      const highestPrioritySubSys = highestPriority;
      return this.getColor(highestPrioritySubSys.stateType.Priority);
    }
  }

  private constructBallonPopup(): any {
    return (
      '<div style="padding-bottom: 10px; font-family: Roboto; ">' +
      `<style>
        .hm-ballon-body--active {
          border-top-color: #458FD3 !important;
          border-top-width: 4px !important;
          transform: translateY(1px);
          border-bottom: none !important;
        }
        .hm-ballon-body-container {
          display: flex;
          border: solid 1px darkgray;
          background: #fff;
          margin-top: 10px;
        }
        .hm--small-margin {
          margin-right: 3px;
        }
        .hm-ballon-body__text {
          margin-bottom: 0 !important;
          font-size: 15px;
        }
        .hm-subsys-main-list_item:last-child {
          margin-bottom: 10px;
        }
        .hm-sub-system-status {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 24px;
        }
        .device-list__item-header {
          cursor: pointer;
        }
        .device-list__item-content {
          user-select: none;
        }
        .device-item__heading {
          display: flex;
          background: #fff;
          align-items: center;
          border: solid 1px #d4d4d4;
          margin-top: 10px;
        }
        .active--device-item-heading {
          border-bottom: solid 5px #F6B904;
          padding-bottom: 0 !important;
        }
        .device-item__content {
          padding: 10px;
          border: solid 1px #d4d4d4;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        #hm-ballon-body__item-content {
          margin-bottom: 10px;
          border: solid 1px darkgray;
          padding: 10px;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
          height: 200px;
          font-size: medium;
          overflow-y: auto !important;
        }
        .arrow--rotate {
          transform: rotate(90deg) translate3d( 0, 0, 0);
          transition: transform .5s;
        }
        .arrow--unrotate {
          transform: rotate(0deg) translate3d( 0, 0, 0);
        }
        .list--circle {
          list-style-type: circle !important;
        }
        .parent-prop--value {
          display: flex;
        }
        .dots-prop--value {
          border-bottom: 1px #ced4da dotted;
        }
        .tab--header {
          margin-bottom: 0 !important;
          padding: 5px;
          cursor: pointer;
          font-weight: 600;
          flex-grow: 1;
          text-align: center;
        }
        .subsys-list-link {
          padding: 5px 4px;
          display: block;
          width: fit-content;
          text-decoration: none !important;
        }
        .subsys-list-link:hover {
          background-color: #418bca;
          color: #fff;
        }
        .zmdi-alert-circle {
          color: #DC143C;
          position: absolute;
          bottom: 0;
          right: 20px;
          font-size: 24px;
        }
      </style>` +
      `<div class="hm-ballon-body-container">
      <div class="hm-ballon-body__item tab--header"><p class="hm-ballon-body__text">${AppLocalization.Label88}</p></div><br />
      <div class="hm-ballon-body__item tab--header"><p class="hm-ballon-body__text">${AppLocalization.NodeProperties}</p></div><br />
      <div class="hm-ballon-body__item tab--header hm--small-margin"><p class="hm-ballon-body__text">${AppLocalization.Label86}</p></div><br />
      </div>` +
      '<div id="hm-ballon-body__item-content"></div>' +
      '</div>'
    );
  }

  private initBallonContent() {
    return (element: any, selectedPoint: MapPointData) => {
      const activeEleClassName = 'active--device-item-heading';
      const contentDisplay = document.getElementById(
        'hm-ballon-body__item-content'
      );
      if (this.activeTab) {
        this.activeTab.classList.remove(activeEleClassName);
      }
      const activeElement = element.classList.contains('hm-ballon-body__item')
        ? element
        : element.parentElement;
      activeElement.classList.add(activeEleClassName);
      this.activeTab = activeElement;
      const tabTitle = element.innerText;
      const sysNames = this.getSubSysNames(selectedPoint);
      const { sysNamesList: nodeDevices } = this.getNodeDevices(selectedPoint);
      if (tabTitle === AppLocalization.ListOfSubsystems) {
        contentDisplay.innerHTML =
          `<ul class="list-group">${sysNames}</ul>` +
          this.subSysLink(selectedPoint);
      } else if (tabTitle === AppLocalization.Label86) {
        contentDisplay.innerHTML = `<ul class="list-group">${nodeDevices}</ul>`;
        this.initLogicDevices();
      } else if (tabTitle === AppLocalization.NodeProperties) {
        this.getNodeProps(selectedPoint.node.Id, contentDisplay);
      }
    };
  }

  private subSysLink(point: any) {
    const node = ((point.node || {}).Nodes || []).find(
      (x: any) => x.Id === point.node.Id
    );
    return node
      ? `<a
    href='/hierarchies-module/node-card/${node.Id}/current-data?idHierarchy=${node.IdHierarchy}'
    target="_blank" class="subsys-list-link">
    ${AppLocalization.Readings}</a>`
      : '';
  }

  /**
   * Create Logic Device Content
   */
  private initLogicDevices() {
    const devices = Array.from(
      document.getElementsByClassName('device-list__item')
    );
    devices.forEach((logicDeviceElement) => {
      this.constructDevicePropAndSubSystem(logicDeviceElement);
    });
  }

  /**Constructs the properties and sub-system content for selected logic device
   * @param logicDeviceElement Logic device list item element
   */
  private constructDevicePropAndSubSystem(logicDeviceElement: Element) {
    logicDeviceElement.addEventListener('click', () => {
      this.currentParent = logicDeviceElement.querySelectorAll('div,i');

      const displayContainer = this.constructListContent();
      this.currentParent = logicDeviceElement.querySelectorAll('div,p,i');

      this.constructInnerListContent(logicDeviceElement, displayContainer);
    });
  }

  /**
   * Get element by class name
   * @param classname Element class name
   * @returns Found Html element
   */
  private getElementByClassname(classname: string) {
    return Array.from(this.currentParent).find((x: HTMLElement) =>
      x.className.includes(classname)
    ) as HTMLElement;
  }

  private constructInnerListContent(
    logicDeviceElement: Element,
    displayContainer: CSSStyleDeclaration
  ) {
    const header = this.getElementByClassname('device-item__heading');
    const propHeader = this.getElementByClassname('device-item__heading-prop');
    const subSystemHeader = this.getElementByClassname(
      'device-item__heading-subsys'
    );

    /**
     * Element container to display results for properties and sub-systems
     */
    const elementContent = this.getElementByClassname('device-item__content');

    this.addEvent(header);
    this.addEvent(elementContent);

    this.addEvent(propHeader, () => {
      this.toggleClass(
        propHeader,
        subSystemHeader,
        'active--device-item-heading'
      );
      this.getItemProps(logicDeviceElement, elementContent);
    });
    this.addEvent(subSystemHeader, () => {
      this.toggleClass(
        subSystemHeader,
        propHeader,
        'active--device-item-heading'
      );
      this.getItemSubSystems(logicDeviceElement, elementContent);
    });
    if (displayContainer.display !== 'none') {
      this.toggleClass(
        subSystemHeader,
        propHeader,
        'active--device-item-heading'
      );
      this.getItemSubSystems(logicDeviceElement, elementContent);
    }
  }

  /**
   * Constructs the parent container list item props and subsystems
   * @returns style of constructed parent
   */
  private constructListContent() {
    /**
     * Parent element to display everything for the list item (properties, sub-systems, headers)
     */
    const propSubSysDisplayContainer = this.getElementByClassname(
      'device-list__item-content'
    );

    const arrow = this.getElementByClassname('zmdi-chevron-right');

    const style = propSubSysDisplayContainer.style;
    // tslint:disable:only-arrow-functions
    style.display =
      style.display !== 'block'
        ? (function () {
            arrow.classList.remove('arrow--unrotate');
            arrow.classList.add('arrow--rotate');
            return 'block';
          })()
        : (function () {
            arrow.classList.remove('arrow--rotate');
            arrow.classList.add('arrow--unrotate');
            return 'none';
          })();
    propSubSysDisplayContainer.innerHTML = `
            <div>
            <div class="device-item__heading">
            <p class="device-item__heading-subsys device-item__heading__item tab--header">${AppLocalization.Label88}</p>
            <p class="device-item__heading-prop device-item__heading__item tab--header">${AppLocalization.Property}</p>
            </div>
            <div class="device-item__content">
            ${AppLocalization.Loading}...
            </div>
            `;
    return style;
  }

  getItemSubSystems(ele: Element, displayEle: Element) {
    const cache = this.logicDevicesListCache.subSys[ele.id];
    if (cache) {
      displayEle.innerHTML = cache;
      return;
    }
    displayEle.innerHTML = `${AppLocalization.Loading}...`;
    this.mapService.getLogicDeviceSubSystems([+ele.id]).then((data) => {
      if (data && Object.keys(data).length) {
        const observs = [
          this.mapService.getSubSystems(),
          this.mapService.getStateType(),
        ];
        forkJoin(observs).subscribe(
          (subSystemStateType: [MapSubSystem[], MapStateType[]]) => {
            let subSysList = '';
            const deviceStateValues =
              (data[ele.id] as MapDataStateValue[]) || [];
            deviceStateValues.forEach((value) => {
              if (value) {
                const mapSubSys = {
                  ...value,
                  subSystem: subSystemStateType[0].find(
                    (x) => x.Id === value.IdSubSystem
                  ),
                  stateType: subSystemStateType[1].find(
                    (x) => x.Id === value.IdStateType
                  ),
                };
                subSysList += `
                <li class="list-group-item hm-sub-system-list">
                <span>${mapSubSys.subSystem.Name}</span>
                <span>
                ${
                  !value.Acknowledged
                    ? '<i class="zmdi zmdi-alert-circle"></i>'
                    : ''
                }
                <i title="${
                  mapSubSys.subSystem.Name
                }" style="color:${this.getColor(
                  mapSubSys.stateType.Priority
                )};" class="zmdi zmdi-network${
                  value.IsDataRotten ? '-outline' : ''
                } hm-sub-system-status"></i></span>
                </li>`;
              } else {
                subSysList += `<li>${AppLocalization.Label18}/li>`;
              }
            });
            const subSysContent = `<ul class="list-group">${subSysList}</ul>`;
            this.logicDevicesListCache.subSys[ele.id] = subSysContent;
            displayEle.innerHTML = subSysContent;
          }
        );
      } else {
        displayEle.innerHTML = AppLocalization.Label18;
      }
    });
  }

  /**
   * Updates ballon colors during filter
   */
  updateNodeColor(selectedState: any) {
    if (selectedState) {
      const keys = Object.keys(selectedState);
      if (keys.length === 0) {
        this.resetNodeColors();
      } else this.changeNodeColor(selectedState);
    }
  }

  private changeNodeColor(selectedFilterState: any) {
    (this.nodePoints || []).forEach((point) => {
      if (point) {
        const state = point.properties._data.point.state;
        if (state.every((x: any) => x.subSystem.IsCheck)) {
          this.setMapPointIconColor(point, state[0].stateType.Priority);
        } else {
          state.forEach((stateItem: any) => {
            const stateType = stateItem.stateType;
            const subSys = stateItem.subSystem;
            if (stateType.IsCheck || subSys.IsCheck) {
              this.setMapPointIconColor(point, stateType.Priority);
            }
          });
        }
        if (
          selectedFilterState.Acknowledged &&
          selectedFilterState.Acknowledged.length
        ) {
          const ackItem = state.find((x: any) => x.Acknowledged);
          if (ackItem) {
            if (
              selectedFilterState.Acknowledged.indexOf(2) > -1 &&
              ackItem.IdSubSystem === 3
            ) {
              this.setMapPointIconColor(point, 2);
            } else this.setMapPointIconColor(point, ackItem.stateType.Priority);
          } else this.setMapPointIconColor(point, 2);
        }
        if (
          selectedFilterState.IdStateType &&
          selectedFilterState.IdStateType.length
        ) {
          const stateType = state.find(
            (x: any) =>
              x.IdStateType ==
              selectedFilterState.IdStateType[
                selectedFilterState['IdStateType'].length - 1
              ]
          );
          if (stateType) {
            this.setMapPointIconColor(point, stateType.stateType.Priority);
          } else this.setMapPointIconColor(point, 2);
        }
        if (
          selectedFilterState.IsDataRotten &&
          selectedFilterState.IsDataRotten.length
        ) {
          const rotten = state.find(
            (x: any) =>
              x.IsDataRotten ==
              selectedFilterState.IsDataRotten[
                selectedFilterState.IsDataRotten.length - 1
              ]
          );
          if (rotten) {
            this.setMapPointIconColor(point, rotten.stateType.Priority);
          } else this.setMapPointIconColor(point, 2);
        }
      }
    });
  }

  private toggleClass(active: Element, inactive: Element, classname: string) {
    inactive.classList.remove(classname);
    active.classList.add(classname);
  }

  /**
   * Get list item properties and display them
   * @param ele List Item to get properties for
   * @param displayEle Where to display list item properties
   */
  private getItemProps(ele: Element, displayEle: Element) {
    const cache = this.logicDevicesListCache.props[ele.id];
    if (cache) {
      displayEle.innerHTML = cache;
      return;
    }
    displayEle.innerHTML = `${AppLocalization.Loading}...`;
    this.propService
      .getProperties(ele.id, EntityType.LogicDevice)
      .subscribe((result: any[]) => {
        let str = '';
        result.forEach((prop) => {
          str += `
        <div class="device-item-prop__content parent-prop--value">
        <div>${prop.Name}</div>
        <div class="device-item-prop__dots col dots-prop--value"></div>
        <div>${prop.Value}</div>
        </div>`;
        });
        displayEle.innerHTML = str;
        this.logicDevicesListCache.props[ele.id] = str;
      });
  }

  /**
   * Event handler for Logic Devices List Item Properties
   */
  private addEvent(element: Element, callback: any = null) {
    element.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      if (callback) {
        callback();
      }
    });
  }

  private getSubSysNames(selectedPoint: MapPointData) {
    let sysNames = '';
    const node = this.searchPoints.find(
      (point) => point.node.Id === selectedPoint.node.Id
    );
    node.state.forEach((sys) => {
      if (sys) {
        sysNames += `<li class="hm-sub-system-list list--circle list-group-item hm-subsys-main-list_item">
        <span>${sys.subSystem.Name}</span>
        <span>
        ${!sys.Acknowledged ? '<i class="zmdi zmdi-alert-circle"></i>' : ''}
        <i title="${sys.subSystem.Name}" style="color:${this.getColor(
          sys.stateType.Priority
        )};" class="zmdi zmdi-network${
          sys.IsDataRotten ? '-outline' : ''
        } hm-sub-system-status"></i></span>
        </li>`;
      }
    });
    return sysNames;
  }

  /** Get node node devices to be constructed
   * @param selectedPoint Selected point to get logic devices
   * @returns An object Html list elements and selected Node
   */
  private getNodeDevices(selectedPoint: MapPointData) {
    let sysNamesList = '';
    const node = this.searchPoints.find(
      (point) => point.node.Id === selectedPoint.node.Id
    );
    node.extra.forEach((nodeView) => {
      if (nodeView) {
        const element = this.constructLogicDeviceListItem(nodeView);
        sysNamesList += element;
      }
    });
    return { sysNamesList, node };
  }

  /** Construct received node devices
   * @param nodeView Logic device item
   */
  private constructLogicDeviceListItem(nodeView: HierarchyLogicDeviceView) {
    return `<li id="${nodeView.Id}" class="list-group-item device-list__item">
        <div class="d-flex justify-content-between align-items-center device-list__item-header">
        <span>${nodeView.DisplayName}</span>
        <i class="zmdi zmdi-chevron-right"></i>
        </div>
        <div class="device-list__item-content">
        </div>
        </div>
        </li>`;
  }

  private getNodeProps(nodeId: number, display: any) {
    display.innerHTML = `${AppLocalization.Loading}...`;
    this.mapService.getNodeProperties(nodeId).subscribe((data) => {
      if (data) {
        const properties = data.Properties;
        const catProperties = (data.PropertyCategories || []).map(
          (x: any) => x.Properties
        );
        const props = properties.concat(catProperties);
        const propsFlatten = props.flat(Infinity);
        display.innerHTML = this.constructProps(propsFlatten);
      } else {
        display.innerHTML = AppLocalization.NoData;
      }
    });
  }

  private constructProps(data: any) {
    let result = '';
    data.forEach((ele: any) => {
      const propValue = this.isObject(ele.Value) ? ele.Value.Text : ele.Value;
      if (propValue !== null) {
        result += `
      <div class="device-item-prop__content parent-prop--value">
        <div>${ele.Name}</div>
        <div class="device-item-prop__dots col dots-prop--value"></div>
        <div>${propValue}</div>
      </div>`;
      }
    });
    return result;
  }

  private constructBallonBody(logicDevice: HierarchyLogicDeviceNodeView[]) {
    let result = '';
    for (const device of logicDevice) {
      result += `<li>${device.DisplayName}</li>`;
    }
    return result;
  }

  private resetNodeColors() {
    this.nodePoints.forEach((point, i) => {
      point.options.set('iconColor', this.nodeColorsDefault[i]);
    });
  }

  private setMapPointIconColor(point: any, color: number) {
    point.options.set('iconColor', this.getColor(color));
  }

  private getColor(colorVal: number) {
    return this.colorStatePipe.setSubSystemColor(colorVal);
  }

  private isObject(obj: any) {
    return obj !== null && obj.constructor.name === 'Object';
  }
}
