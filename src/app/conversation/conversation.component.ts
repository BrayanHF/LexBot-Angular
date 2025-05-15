import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidemenuComponent } from '../shared/components/sidemenu/sidemenu.component';
import { SideMenuService } from '../shared/services/side-menu.service';

@Component({
  imports: [ SidemenuComponent, RouterOutlet, NgClass, HeaderComponent ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

}
