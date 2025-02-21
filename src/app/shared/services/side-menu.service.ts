import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  public isOpen = signal<boolean>(true);

  public toggleSideMenu(): void {
    this.isOpen.update(state => !state);
  }

}
