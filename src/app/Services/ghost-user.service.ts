import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GhostUserService {
  public userName = new BehaviorSubject<string>('');
  public userName$ = this.userName.asObservable();

  constructor() {
    this.setInitialGhostName();
  }

  private setInitialGhostName(): void {
    const randomNumbers = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const ghostName = `Ghost-${randomNumbers}`;
    this.userName.next(ghostName);
  }
}
