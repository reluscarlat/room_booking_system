import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from './../../services/data.service';
import { Booking } from './../../models/Booking';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookings: Array<Booking>;
  selectedDate: string;
  dataLoaded = false;
  message = '';
  isAdminUser = false;

  constructor(private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  loadData() {
    this.message = 'Loading...';
    this.route.queryParams.subscribe(
      (params) => {
        this.selectedDate = params['date'];
        if (!this.selectedDate) {
          this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
        }
        this.dataService.getBookings(this.selectedDate).subscribe(
          next => {
            this.bookings = next;
            this.dataLoaded = true;
            this.message = '';
          },
          error => {
            this.message = 'Sorry, the data could not be loaded.';
          }
        );
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
    if (this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
  }

  editBooking(id: number) {
    this.router.navigate(['editBooking'], { queryParams: { id } });
  }

  addBooking() {
    this.router.navigate(['addBooking'])
  }

  deleteBooking(id: number) {
    const result = confirm('Are your sure you wish to delete this booking?');
    if (result) {
      this.message = 'deleting...';
      this.dataService.deleteBooking(id).subscribe(
        next => {
          this.message = '';
          this.loadData();
        },
        error => {
          this.message = 'Sorry, there was a problem deleting the item.';
        }
      );
    }
  }

  dateChanged() {
    this.router.navigate([''], { queryParams: { date: this.selectedDate } });
  }
}
