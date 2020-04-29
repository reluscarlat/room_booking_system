import { AuthService } from './../../../services/auth.service';
import { Room } from '../../../models/Room';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;
  loadingData = true;
  message = 'Loading data...';
  reloadAttempts = 0;
  isAdminUser = false;

  constructor(private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  loadData() {
    this.dataService.getRooms().subscribe(
      next => {
        this.rooms = next;
        this.loadingData = false;
        this.processUrlParams();
      },
      error => {
        if (error.status === 402) {
          this.message = 'Sorry, you need to pay to use this application';
        } else {
          this.reloadAttempts++;
          if (this.reloadAttempts <= 10) {
            this.message = 'Sorry, something went wrong. Trying again... please wait.';
            this.loadData();
          } else {
            this.message = 'Sorry, something went wrong. Please contact support.';
          }
        }
      }
    );
  }

  processUrlParams() {
    this.route.queryParams.subscribe(
      params => {
        this.action = null;
        const id = +params['id'];
        if (id) {
          this.selectedRoom = this.rooms.find(room => room.id === id);
          this.action = params['action'];
        }
        if (params['action'] === 'add') {
          this.selectedRoom = new Room();
          this.action = 'add';
        }
      }
    );
  }

  ngOnInit(): void {
    if (this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
    this.loadData();
  }

  setRoom(id: number) {
    this.router.navigate(['admin', 'rooms'], { queryParams: { id: id, action: 'view' } });
  }

  addRoom() {
    this.router.navigate(['admin', 'rooms'], { queryParams: { action: 'add' } });
  }
}
