export class Room {
  id: number;
  name: string;
  location: string;
  capacities = new Array<LayoutCapacity>();

  static fromHttp(room: Room): Room {
    const newRoom = new Room();
    newRoom.id = room.id;
    newRoom.name = room.name;
    newRoom.location = room.location;
    newRoom.capacities = new Array<LayoutCapacity>();
    room.capacities.forEach(capacity => newRoom.capacities.push(capacity));
    return newRoom;
  }
}

export class LayoutCapacity {
  layout: Layout;
  capacity: number;

  static fromHttp(lc: LayoutCapacity): LayoutCapacity {
    const newLc = new LayoutCapacity();
    newLc.capacity = lc.capacity;
    newLc.layout = Layout[lc.layout];
    return newLc;
  }
}

export enum Layout {
  THEATER = 'Theater',
  USHAPE = 'U-Shape',
  BOARD = 'Board Meeting'
}
