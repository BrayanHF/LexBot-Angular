import { NgClass, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { SideMenuService } from '../../services/side-menu.service';
import { DOCUMENT_GENERATORS } from '../../types/document-generators';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'shared-header',
  imports: [
    NgClass,
    ToggleSidemenuComponent,
    UserMenuComponent,
    NgIf
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  private sideMenuService = inject(SideMenuService);
  private deviceService = inject(DeviceService);

  public showSideMenu = computed(this.sideMenuService.isOpen);
  public isMobile = this.deviceService.isMobile;
  public title = inject(Title);
  public document_labels: string[] = Object.values(DOCUMENT_GENERATORS).map(gen => gen.label);

}
