export class Tile {
  id?: number;
  name: string;
  url: string;
  icon: string;
  sortOrder: number;
  parent?: Tile;
  children?: Tile[];
}
