import { MapSubSystem } from './../../../../services/additionally-hierarchies/Models/SubSystem';
import { HierarchyNodeView } from './../../../../services/additionally-hierarchies/Models/HierarchyNodeView';
import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HierarchyMapService } from './../../../../services/additionally-hierarchies/hierarchy-map.service';
import { Subscription, defer } from 'rxjs';
import { HierarchyMapRomService } from 'src/app/services/additionally-hierarchies/hierarchy-map-rom.service';
import { HierarchyMapRom } from 'src/app/services/additionally-hierarchies/Models/HierarchyMapRom';
import { GlobalValues } from 'src/app/core';
import { MapDataStateValue } from 'src/app/services/additionally-hierarchies/Models/MapDataStateValue';
import { MapPointData } from 'src/app/services/additionally-hierarchies/Models/MapPointData';
import { HierarchyMainStatesService } from 'src/app/services/hierarchy-main/hierarchy-main-states.service';
import { FilterStateService } from '../hierarchy-main/services/filter-state.service';
import {
  IHierarchyNodesView,
  HierarchyLogicDeviceNodeViewState,
} from '../hierarchy-main/hierarchy-main.component';
import { MapData } from 'src/app/services/hierarchy-main/Models/MapData';

@Component({
  selector: 'rom-hierarchy-map',
  templateUrl: './hierarchy-map.component.html',
  styleUrls: ['./hierarchy-map.component.less'],
})
export class HierarchyMapComponent implements OnDestroy {
  private map$: Subscription;
  map: any;
  noCoords = false;
  errors: any[] = [];
  private _dataSource: MapData;
  filterToggle = true;
  subSystems: MapSubSystem[];
  mapInit: boolean;
  globalFilterState: any;
  @Output() onDataFilter = new EventEmitter<any>();
  @Input()
  public get dataSource(): MapData {
    return this._dataSource;
  }
  public set dataSource(value: MapData) {
    if (value && value.data.length) {
      this.noCoords = false;
      this._dataSource = value;
      this.updateMap(value.data);
    } else {
      this.triggerEmpty();
    }
  }
  constructor(
    private mapService: HierarchyMapService,
    private romMapService: HierarchyMapRomService,
    public filterStateService: FilterStateService,
    public hierarchyMainStatesService: HierarchyMainStatesService
  ) {}

  updateMap(nodes: HierarchyNodeView[]) {
    const serv = this.romMapService;
    serv.hierarchyId = GlobalValues.Instance.hierarchyApp.Id;
    const getCoords = serv.getLatLongs(nodes.map((x) => x.Id));
    const getCoords$ = defer(() => getCoords);
    getCoords$.subscribe(
      (data: HierarchyMapRom) => {
        this.initMapPoints(data, nodes);
      },
      (err) => (this.errors = [err])
    );
  }

  showSelectedFilters(
    subSystems: IHierarchyNodesView[] | HierarchyLogicDeviceNodeViewState[]
  ) {
    (this.mapService.nodePoints || []).forEach((nodePoint) => {
      if (nodePoint) {
        if (subSystems) {
          const subSys = (subSystems as any).find(
            (sub: IHierarchyNodesView | HierarchyLogicDeviceNodeViewState) =>
              sub.Id === nodePoint.properties._data.point.node.Id
          );
          if (subSys) {
            nodePoint.options.set('visible', true);
            this.mapService.cluster.add([nodePoint]);
          } else {
            nodePoint.options.set('visible', false);
            this.mapService.cluster.remove(nodePoint);
          }
        }
      }
    });
  }

  filterItems(state: any) {
    const clone = (this.dataSource || ({} as any)).data as
      | IHierarchyNodesView[]
      | HierarchyLogicDeviceNodeViewState[];
    const data = this.filterStateService.applyFilter(state, clone);
    this.mapService.updateNodeColor(state);
    this.showSelectedFilters(data);
    this.onDataFilter.emit(state);
  }

  private initMapPoints(data: HierarchyMapRom, nodes: HierarchyNodeView[]) {
    if (!Object.keys(data).length) {
      this.triggerEmpty();
    } else {
      this.mapInit = true;
      this.constructMapPoints(data, nodes);
    }
  }

  private constructMapPoints(
    data: HierarchyMapRom,
    nodes: HierarchyNodeView[]
  ) {
    const mapData = this.initPointsData(data, nodes);

    // filtering nodes with both lat and long
    const allCoords = mapData.filter((x) => x.coords.length === 2);

    // filtering nodes with status
    const displayPoints = allCoords.filter((x) => x.state.length);
    this.subSystems = [];
    displayPoints.forEach((point) =>
      point.state.forEach((x) => this.subSystems.push(x.subSystem))
    );
    this.subSystems = this.subSystems.filter(
      (sub, index) =>
        this.subSystems.findIndex((subSys) => subSys.Id === sub.Id) === index
    );
    this.initMap(displayPoints);
  }

  private initPointsData(data: HierarchyMapRom, nodes: HierarchyNodeView[]) {
    const coordsData = data;

    return Object.keys(coordsData).map((coord) => {
      const nodeCoords = this.initNodeCoords(nodes, coord, coordsData);
      return nodeCoords;
    });
  }

  private initNodeCoords(
    nodes: HierarchyNodeView[],
    coord: string,
    coordsData: HierarchyMapRom
  ): MapPointData {
    const subSystems = this.dataSource.subSystems;
    const stateTypes = this.dataSource.stateType;
    const nodeWithCoords = nodes.find((x) => +x.Id === +coord);
    const nodeCoords = {
      coords: coordsData[coord].map((x) =>
        String(Math.trunc(x.Value)).length < 3
          ? x.Value
          : +String(x.Value).substr(0, 2)
      ),
      node: nodeWithCoords,
      text: nodeWithCoords.Name,
      value: nodeWithCoords.Name,
      extra: nodeWithCoords.LogicDevices,
      state: (((nodeWithCoords as any).SubSystemsStates ||
        []) as MapDataStateValue[]).map((mapState) => {
        if (mapState) {
          const subSystem = subSystems.find(
            (sys) => sys.Id === mapState.IdSubSystem
          );
          const stateType = stateTypes.find(
            (sType) => sType.Id === mapState.IdStateType
          );
          const obj = { ...mapState, subSystem, stateType };
          return obj;
        } else {
          return;
        }
      }),
    };
    return nodeCoords;
  }

  private triggerEmpty() {
    if (this.map) {
      this.map.destroy();
      this.map.events.add('destroy', () => {
        this.noCoords = true;
      });
    } else {
      this.noCoords = true;
    }
  }

  private initMap(mapPoints: any[]) {
    this.mapService.mapContainer = 'map-container'; // container to render map
    this.mapService.searchBox = 'hm-searchBox'; // search box id
    this.mapService.coordinates = [55.751574, 37.573856]; // Starting coordinates - Moscow
    this.mapService.searchPoints = mapPoints;
    this.map$ = this.mapService.getMap().subscribe(
      (map) => {
        this.map = map;
      },
      (error) => {
        this.errors = [error];
      }
    );
  }

  ngOnDestroy() {
    if (this.map$) {
      this.map$.unsubscribe();
    }
  }
}
