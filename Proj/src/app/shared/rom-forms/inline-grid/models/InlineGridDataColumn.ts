import { InlineGridColumn } from './InlineGridColumn';

export interface IInlineGridRouteData {
  service: any;
  columns: InlineGridColumn[];
  title: string;
  access: any;
}

export class InlineGridRouteData implements IInlineGridRouteData {
  service: any;
  columns: InlineGridColumn[];
  title: string;
  access: any;
}
