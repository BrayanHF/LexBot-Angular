import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
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

  isMobile = input.required<boolean>();

  private sideMenuService = inject(SideMenuService);

  public showSideMenu = computed(this.sideMenuService.isOpen)

}
