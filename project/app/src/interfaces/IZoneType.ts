export interface IZoneType {
  id: string;
  name: string;
  order: number;
  parent: string;
  active: boolean;
  icon:
    | 'default'
    | 'bed'
    | 'books'
    | 'garden'
    | 'home'
    | 'kitchen'
    | 'living'
    | 'roof'
    | 'shower'
    | 'stairs-down'
    | 'stairs-up'
    | 'toilet';
}
export interface IZoneTypeList {
  [key: string]: IZoneType;
}
