import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userIsLoggedIn = false;

  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.userIsLoggedIn = true;
    }
  }

  navigateToRoomsAdmin() {
    this.router.navigate(['admin', 'rooms']);
  }

  navigateToUsersAdmin() {
    this.router.navigate(['admin', 'users']);
  }

  navigateToCalendar() {
    this.router.navigate(['']);
  }

  logout() {
    this.authService.logout();
    this.navigateToCalendar();
  }
}
