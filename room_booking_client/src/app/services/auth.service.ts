import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;
  authenticationResultEvent = new EventEmitter<boolean>();
  role: string;

  constructor(private dataService: DataService) { }

  authenticate(name: string, password: string) {
    this.dataService.validateUser(name, password).subscribe(
      next => {
        this.isAuthenticated = true;
        this.setUpRole();
      },
      error => {
        this.isAuthenticated = false;
        this.authenticationResultEvent.emit(false);
      }
    );
  }

  setUpRole() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        this.authenticationResultEvent.emit(true);
      }
    );
  }

  checkIfAlreadyAuthenticated() {
    this.dataService.getRole().subscribe(     // Check if that cookie already exists in backend server
      next => {
        if (next.role !== '') {
          this.isAuthenticated = true;
          this.authenticationResultEvent.emit(true);
        }
      }
    )
  }

  logout() {
    this.dataService.logout().subscribe();
    this.isAuthenticated = false;
    this.authenticationResultEvent.emit(false);
  }
}
