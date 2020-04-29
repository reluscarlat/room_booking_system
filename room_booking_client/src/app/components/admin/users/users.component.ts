import { AuthService } from './../../../services/auth.service';
import { DataService } from './../../../services/data.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Array<User>;
  selectedUser: User;
  action: string;
  message = 'Loading data...';
  loadingData = true;
  reloadAttempts = 0;
  isAdminUser = false;

  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  loadData() {
    this.dataService.getUsers().subscribe(
      next => {
        this.users = next;
        this.loadingData = false;
        this.processUrlParams();
      },
      error => {
        if (error.status === 402) {
          this.message = 'Sorry, you need to pay to use this application';
        } else {
          if (this.reloadAttempts < 10) {
            this.reloadAttempts++;
            this.message = 'Sorry, something went wrong... trying to reload';
            this.loadData();
          } else {
            this.message = 'Sorry, an error occurred ... please contact support';
          }
        }
      }
    );
  }

  processUrlParams() {
    this.route.queryParams.subscribe(
      params => {
        const id = +params['id'];
        this.action = params['action'];
        if (id) {
          this.selectedUser = this.users.find(user => user.id === id);
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
    if (this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
  }

  selectUser(id: number) {
    this.router.navigate(['admin', 'users'], { queryParams: { id: id, action: 'view' } });
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], { queryParams: { action: 'add' } });
  }
}
