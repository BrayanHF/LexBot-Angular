import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SidemenuComponent } from '../shared/sidemenu/sidemenu.component';
import { ToggleSidemenuComponent } from '../shared/toggle-sidemenu/toggle-sidemenu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { Chat } from './interfaces/chat.interface';
import ChatComponent from './pages/chat/chat.component';
import { SideMenuService } from '../shared/services/side-menu.service';

@Component({
  imports: [ SidemenuComponent, ChatComponent, RouterOutlet, ToggleSidemenuComponent, UserMenuComponent ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private sideMenuService = inject(SideMenuService);

  public showSideMenu = computed(this.sideMenuService.isOpen)

}
