import { Room, Layout } from './../models/Room';
import { environment } from './../../environments/environment';
import { Booking } from './../models/Booking';
import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  public getRooms(): Observable<Array<Room>> {
    return this.http.get<Array<Room>>(environment.restUrl + '/api/rooms', { withCredentials: true })
      .pipe(map(data => {
        const rooms = new Array<Room>();
        data.forEach(room => rooms.push(Room.fromHttp(room)));
        return rooms;
      }));
  }

  public getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(environment.restUrl + '/api/users', { withCredentials: true })
      .pipe(map(data => {
        const users = new Array<User>();
        for (const user of data) {
          users.push(User.fromHttp(user));
        }
        return users;
      }));
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(environment.restUrl + '/api/users', user, { withCredentials: true });
  }

  public addUser(newUser: User, password: string): Observable<User> {
    const fullUser = { id: newUser.id, name: newUser.name, password: password };
    return this.http.post<User>(environment.restUrl + '/api/users', fullUser, { withCredentials: true });
  }

  private getCorrectedRoom(room: Room) {
    const correctedRoom = {
      id: room.id,
      name: room.name,
      location: room.location,
      capacities: []
    };
    for (const lc of room.capacities) {

      let correctLayout;
      for (const member in Layout) {
        if (Layout[member] === lc.layout) {
          correctLayout = member;
        }
      }

      const correctedLayout = { layout: correctLayout, capacity: lc.capacity };
      correctedRoom.capacities.push(correctedLayout);
    }
    return correctedRoom;
  }

  updateRoom(room: Room): Observable<Room> {
    const headers = new HttpHeaders().append('Authorization', 'Bearer ');
    return this.http.put<Room>(environment.restUrl + '/api/rooms', this.getCorrectedRoom(room), { withCredentials: true });
  }

  addRoom(newRoom: Room): Observable<Room> {
    return this.http.post<Room>(environment.restUrl + '/api/rooms', this.getCorrectedRoom(newRoom), { withCredentials: true });
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete<any>(environment.restUrl + '/api/rooms/' + id, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(environment.restUrl + '/api/users/' + id, { withCredentials: true });
  }

  resetUserPassword(id: number): Observable<any> {
    return this.http.get<any>(environment.restUrl + '/api/users/reset-password/' + id, { withCredentials: true });
  }

  getBookings(date: string): Observable<Array<Booking>> {
    return this.http.get<Array<Booking>>(environment.restUrl + '/api/bookings/' + date)
      .pipe(
        map(data => {
          const bookings = new Array<Booking>();
          for (const booking of data) {
            bookings.push(Booking.fromHttp(booking));
          }
          return bookings;
        })
      );
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(environment.restUrl + '/api/bookings?id=' + id, { withCredentials: true })
      .pipe(
        map(data => Booking.fromHttp(data))
      );
  }

  private getCorrectedBooking(booking: Booking) {

    let correctLayout;
    for (let member in Layout) {
      if (Layout[member] === booking.layout) {
        correctLayout = member;
      }
    }

    if (booking.startTime.length < 8) {
      booking.startTime = booking.startTime + ':00';
    }

    if (booking.endTime.length < 8) {
      booking.endTime = booking.endTime + ':00';
    }

    const correctedBooking = {
      id: booking.id, room: this.getCorrectedRoom(booking.room), user: booking.user,
      title: booking.title, date: booking.date, startTime: booking.startTime, endTime: booking.endTime,
      participants: booking.participants, layout: correctLayout
    };

    return correctedBooking;
  }

  saveBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(environment.restUrl + '/api/bookings', this.getCorrectedBooking(booking), { withCredentials: true });
  }

  addBooking(newBooking: Booking): Observable<Booking> {
    return this.http.post<Booking>(environment.restUrl + '/api/bookings', this.getCorrectedBooking(newBooking), { withCredentials: true });
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + '/api/bookings/' + id, { withCredentials: true });
  }

  validateUser(name: string, password: string): Observable<{ result: string }> {
    const authData = btoa(`${name}:${password}`);
    const headers = new HttpHeaders().append('Authorization', 'Basic ' + authData);
    return this.http.get<{ result: string }>(environment.restUrl + '/api/basicAuth/validate', { headers, withCredentials: true });
  }

  getRole(): Observable<{ role: string }> {
    // tslint:disable-next-line:max-line-length
    const headers = new HttpHeaders().append('X-Requested-With', 'XMLHttpRequest'); // Prevent the login header to appear on cookie expiration
    return this.http.get<{ role: string }>(environment.restUrl + '/api/users/current-user-role', { headers, withCredentials: true });
  }

  logout(): Observable<string> {
    return this.http.get<string>(environment.restUrl + '/api/users/logout', { withCredentials: true });
  }

  constructor(private http: HttpClient) {
  }
}
