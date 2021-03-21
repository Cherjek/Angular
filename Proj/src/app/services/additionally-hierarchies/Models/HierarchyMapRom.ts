export interface HierarchyMapRom {
  [key: string]: MapCoords[];
}

export class HierarchyMapRom implements HierarchyMapRom {}

export interface MapCoords {
  Code: 'Latitude' | 'Longitude';
  Value: number;
}
