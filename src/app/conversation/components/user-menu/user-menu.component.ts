import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { filter, map, take } from 'rxjs';

@Component({
  selector: 'conversation-user-menu',
  imports: [
    AsyncPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {

  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  public currentUserLetter = this.authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      return user?.displayName?.charAt(0).toUpperCase() ?? "";
    })
  );

  public isOpen = signal(false);

  public toggleMenu() {
    this.isOpen.update(isOpen => !isOpen);
  }

  public logout() {
    this.authService.logout();
  }

  @HostListener('document:click', [ '$event' ])
  clickOutside(event: Event) {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

}
