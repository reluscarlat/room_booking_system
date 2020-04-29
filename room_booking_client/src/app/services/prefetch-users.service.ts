import { DataService } from './data.service';
import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrefetchUsersService implements Resolve<Observable<Array<User>>>{

  constructor(private dataService: DataService) { }

  resolve() {
    return this.dataService.getUsers();
  }
}
