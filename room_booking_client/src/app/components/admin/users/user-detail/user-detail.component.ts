import { AuthService } from './../../../../services/auth.service';
import { DataService } from './../../../../services/data.service';
import { Router } from '@angular/router';
import { User } from './../../../../models/User';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input()
  user: User;

  @Output()
  dataChangedEvent = new EventEmitter();
  message = '';
  isAdminUser = false;

  constructor(private dataService: DataService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
  }

  editUser() {
    this.router.navigate(['admin', 'users'], { queryParams: { id: this.user.id, action: 'edit' } });
  }

  deleteUser() {
    const result = confirm('Are your sure you wish to delete this user?');
    if (result) {
      this.dataService.deleteUser(this.user.id).subscribe(
        next => {
          this.message = 'Deleting...';
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users']);
        },
        error => {
          this.message = 'Sorry, but this user cannot be deleted at this time.';
        }
      );
    }
  }

  resetPassword() {
    this.message = 'Please wait...';
    this.dataService.resetUserPassword(this.user.id).subscribe(
      next => {
        this.message = 'The password has been reset.';
      },
      error => {
        this.message = 'Sorry, something went wrong.';
      }
    );
  }
}
