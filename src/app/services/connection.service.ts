import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private statusConnection$ = new Subject<boolean>();

  constructor() {
    // Adiciona o evento "online"
    window.addEventListener('online', () => {
      this.setStatusConnection();
    });

    // Adiciona o evento "offline"
    window.addEventListener('offline', () => {
      this.setStatusConnection();
    });
  }

  // Retorna true ou false se tiver online/offline
  get isOnline(): boolean {
    return !!window.navigator.onLine;
  }

  // Evento que será escutado
  get statusConnection(): Observable<boolean> {
    return this.statusConnection$.asObservable();
  }

  // Emite o evento
  setStatusConnection() {
    return this.statusConnection$.next(this.isOnline);
  }
}
