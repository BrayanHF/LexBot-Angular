import { BreakpointObserver} from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { UserMenuComponent } from '../../../conversation/components/user-menu/user-menu.component';
import { SideMenuService } from '../../services/side-menu.service';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';

@Component({
  selector: 'shared-header',
  imports: [
    NgClass,
    ToggleSidemenuComponent,
    UserMenuComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  private bpo = inject(BreakpointObserver);
  public isMobile = signal<boolean>(false);

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen)

  constructor() {
    this.mobileObserver();
  }

  private mobileObserver(): void {
    this.bpo.observe([ '(max-width: 767px)' ])
      .subscribe(
        res => this.isMobile.set(res.matches)
      );
  }

}
