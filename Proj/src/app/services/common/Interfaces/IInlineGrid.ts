export interface IInlineGrid {
  create?: (x?: any) => any;
  read: (x?: any) => any;
  update?: (x?: any) => any;
  remove?: (x?: any) => any;
  params: any;
}
