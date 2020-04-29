import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Room } from './../models/Room';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrefetchRoomsService implements Resolve<Observable<Array<Room>>>{

  constructor(private dataService: DataService,
    private authService: AuthService) { }

  resolve() {
    return this.dataService.getRooms();
  }
}
