// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  constructor() {}

  private initSocket() {
    if (!this.socket) {
      this.socket = io('http://localhost:8080');

      this.socket.on('connect', () => {
        console.log('✅ Conectado al servidor de sockets con ID:', this.socket!.id);
      });

      this.socket.on('connect_error', (err) => {
        console.error('❌ Error al conectar al servidor de sockets:', err);
      });
    }
  }

  emitCustomEvent(event: string, data: any) {
    this.initSocket();
    this.socket?.emit(event, data);
  }

  listenToCustomEvent(eventName: string): Observable<any> {
    this.initSocket();
    return new Observable((subscriber) => {
      this.socket!.on(eventName, (data) => {
        subscriber.next(data);
      });
      return () => {
        this.socket!.off(eventName);
      };
    });
  }
}