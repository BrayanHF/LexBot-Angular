import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SidemenuComponent } from '../shared/sidemenu/sidemenu.component';
import { Chat } from './interfaces/chat.interface';
import ConversationComponent from './pages/conversation/conversation.component';
import { SideMenuService } from '../shared/services/side-menu.service';

@Component({
  imports: [ SidemenuComponent, ConversationComponent ],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatComponent {

  private sideMenuService = inject(SideMenuService);

  public showSideMenu = computed(this.sideMenuService.isOpen)

  public chat = signal<Chat>({
    id: '',
    title: '',
    lastUse: new Date(),
  });

  public setChat(chat: Chat) {
    this.chat.set(chat);
  }

}
