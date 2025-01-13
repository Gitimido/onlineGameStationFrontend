import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Correct the path to the environment file

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to the Socket.io server
    this.socket = io(environment.socketServerUrl); // Replace with your server URL
  }

  // Emit an event to the server
  sendMessage(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  // Listen for an event from the server
  onMessage(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Clean up the listener when the observer is unsubscribed
      return () => this.socket.off(event);
    });
  }
}
