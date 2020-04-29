import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message = '';
  name: string;
  password: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.authService.authenticationResultEvent.subscribe(
      result => {
        if (result) {
          let url = '';
          this.activatedRoute.queryParams.subscribe(
            params => url = params['requested']
          );
          this.router.navigateByUrl(url);
        } else {
          this.message = 'Wrong username or password';
        }
      }
    );
    this.authService.checkIfAlreadyAuthenticated();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.authService.authenticate(this.name, this.password);
  }

}
