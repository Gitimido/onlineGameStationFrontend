import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignalHelperService {
  // Expose the signal as a public property
  public darkMode = signal<boolean>(false);

  setDarkMode(value: boolean) {
    this.darkMode.set(value);
  }

  constructor() {}
}
