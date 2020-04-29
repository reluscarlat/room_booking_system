import { AuthRouteGuardService } from './services/auth-route-guard.service';
import { PrefetchUsersService } from './services/prefetch-users.service';
import { PrefetchRoomsService } from './services/prefetch-rooms.service';
import { RoomDetailComponent } from './components/admin/rooms/room-detail/room-detail.component';
import { RoomsComponent } from './components/admin/rooms/rooms.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MenuComponent } from './components/menu/menu.component';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/admin/users/users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserDetailComponent } from './components/admin/users/user-detail/user-detail.component';
import { UserEditComponent } from './components/admin/users/user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomEditComponent } from './components/admin/rooms/room-edit/room-edit.component';
import { EditBookingComponent } from './components/calendar/edit-booking/edit-booking.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthRouteGuardService] },
  { path: 'admin/rooms', component: RoomsComponent, canActivate: [AuthRouteGuardService] },
  { path: '', component: CalendarComponent },
  {
    path: 'editBooking', component: EditBookingComponent
    , resolve: {
      rooms: PrefetchRoomsService,
      users: PrefetchUsersService
    },
    canActivate: [AuthRouteGuardService]
  },
  {
    path: 'addBooking', component: EditBookingComponent,
    resolve: {
      rooms: PrefetchRoomsService,
      users: PrefetchUsersService
    },
    canActivate: [AuthRouteGuardService]
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' } // This wild card should be placed at the end of the list.
]

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    CalendarComponent,
    MenuComponent,
    UsersComponent,
    RoomsComponent,
    PageNotFoundComponent,
    RoomDetailComponent,
    UserDetailComponent,
    UserEditComponent,
    RoomEditComponent,
    EditBookingComponent,
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule, // for reactive forms
    BrowserModule,   // for ngIf, ngFor
    FormsModule,     // for forms
    HttpClientModule, // allows to use the HttpClient object
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
