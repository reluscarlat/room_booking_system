import { map } from 'rxjs/operators';
import { User } from './../../../models/User';
import { DataService } from './../../../services/data.service';
import { Room, Layout } from './../../../models/Room';
import { Booking } from './../../../models/Booking';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {

  booking: Booking;
  rooms: Array<Room>;
  layouts = Object.keys(Layout);
  layoutEnum = Layout;
  users: Array<User>;

  dataLoaded = false;
  preprocessingSteps = 0;
  message = '';

  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = 'Loading data...';
    let id: number;

    this.rooms = this.route.snapshot.data['rooms']; // prefetch rooms
    this.users = this.route.snapshot.data['users']; // prefetch users

    // this.dataService.getRooms().subscribe(
    //   next => {
    //     this.rooms = next;
    //     this.preprocessingSteps++;
    //   }
    // );
    // this.dataService.getUsers().subscribe(
    //   next => {
    //     this.users = next;
    //     this.preprocessingSteps++;
    //   }
    // );

    this.route.queryParams.subscribe(
      params => id = params['id']
    );
    if (id) {
      this.dataService.getBooking(+id)
        .pipe(
          map(booking => {
            booking.room = this.rooms.find(room => room.id === booking.room.id);
            booking.user = this.users.find(user => user.id = booking.user.id);
            return booking;
          })
        )
        .subscribe(
          next => {
            this.booking = next;
            this.dataLoaded = true;
            this.message = null;
          }
        );
    } else {
      this.booking = new Booking();
      this.dataLoaded = true;
      this.message = '';
    }
  }

  onSubmit() {
    if (this.booking.id) {
      this.dataService.saveBooking(this.booking).subscribe(
        (booking) => {
          this.router.navigate(['']);
        }
      );
    } else {
      this.dataService.addBooking(this.booking).subscribe(
        (booking) => {
          this.router.navigate(['']);
        }
      );
    }
  }
}
