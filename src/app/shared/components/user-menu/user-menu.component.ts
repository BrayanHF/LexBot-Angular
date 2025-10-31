import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { filter, map, take } from 'rxjs';
import { DialogService } from '../../services/dialog.service';

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
  private dialogService = inject(DialogService);

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
    this.toggleMenu();

    this.dialogService.configDialog({
      title: "Cerrar sesión",
      message: "¿Estás seguro de que deseas cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.",
      showCancelBotton: true,
      showConfirmBotton: true,
      showDeleteBotton: false,
      action: () => this.authService.logout()
    });

    this.dialogService.showDialog.set(true);
  }

  @HostListener('document:click', [ '$event' ])
  clickOutside(event: Event) {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

}
