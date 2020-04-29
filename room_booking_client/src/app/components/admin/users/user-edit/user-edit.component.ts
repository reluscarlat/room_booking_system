import { Router } from '@angular/router';
import { DataService } from './../../../../services/data.service';
import { User } from './../../../../models/User';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @Input()
  user: User;
  message: string;
  formUser: User = new User();
  password: string;
  password2: string;
  nameIsValid = false;
  passwordIsValid = false;
  password2IsValid = false;
  passwordsMatch = true;
  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.user == null) {
      this.user = new User();
    } else {
      this.passwordIsValid = true;
      this.password2IsValid = true;
    }
    this.formUser = Object.assign(this.formUser, this.user);
    this.checkIfNameIsValid();
  }

  onSubmit() {
    this.message = 'Saving...';
    this.checkIfPasswordsMatch();
    if (!this.passwordsMatch) {
      return;
    }
    if (this.formUser.id == null) {
      this.dataService.addUser(this.formUser, this.password).subscribe(
        user => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users'], { queryParams: { id: user.id, action: 'view' } });
        },
        error => {
          this.message = 'An error occurred and the data wasn\'t saved';
        }
      );
    } else {
      this.dataService.updateUser(this.formUser).subscribe(
        user => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users'], { queryParams: { id: user.id, action: 'view' } });
        },
        error => {
          this.message = 'An error occurred and the data wasn\'t saved';
        }
      );
    }
  }

  checkIfNameIsValid() {
    if (this.formUser.name) {
      this.nameIsValid = this.formUser.name.trim().length > 0;
    } else {
      this.nameIsValid = false;
    }
  }

  checkIfPasswordIsValid(passwordIndex: number) {
    if (+passwordIndex === 1) {
      if (this.password) {
        this.passwordIsValid = this.password.trim().length > 0;
      } else {
        this.passwordIsValid = false;
      }
    }
    if (+passwordIndex === 2) {
      if (this.password2) {
        this.password2IsValid = this.password2.trim().length > 0;
      } else {
        this.password2IsValid = false;
      }
    }
  }

  checkIfPasswordsMatch() {
    this.passwordsMatch = this.password === this.password2;
  }
}
