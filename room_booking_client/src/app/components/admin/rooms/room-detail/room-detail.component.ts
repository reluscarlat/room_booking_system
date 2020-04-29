import { AuthService } from './../../../../services/auth.service';
import { DataService } from './../../../../services/data.service';
import { Router } from '@angular/router';
import { Room } from './../../../../models/Room';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {

  @Input()
  room: Room;

  @Output()
  dataChangedEvent = new EventEmitter();

  message = '';
  isAdminUser = false;

  constructor(private router: Router,
    private dataService: DataService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdminUser = this.authService.role === 'ADMIN' ? true : false;
    console.log("RoomDetailComponent -> ngOnInit -> this.authService.role", this.authService.role);
    console.log("RoomDetailComponent -> ngOnInit -> this.isAdminUser", this.isAdminUser);
  }

  editRoom() {
    this.router.navigate(['admin', 'rooms'], { queryParams: { action: 'edit', id: this.room.id } });
  }

  deleteRoom() {
    const result = confirm('Are your sure you wish to delete this room?');
    if (result) {
      this.message = 'deleting...';
      this.dataService.deleteRoom(this.room.id).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms']);
        },
        error => {
          this.message = 'Sorry, this room cannot be deleted at this time';
        }
      );
    }
  }
}
