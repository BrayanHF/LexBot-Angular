import { State } from '../../interfaces/state.interface';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ToggleSidemenuComponent } from '../../../shared/toggle-sidemenu/toggle-sidemenu.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { Message } from '../../interfaces/message.interface';
import { ChattingService } from '../../services/chatting.service';
import { MessageListComponent } from "../../components/message-list/message-list.component";
import { SideMenuService } from '../../../shared/services/side-menu.service';

@Component({
  selector: 'chat-conversation',
  imports: [ ToggleSidemenuComponent, UserMenuComponent, MessageInputComponent, MessageListComponent ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private chattingService = inject(ChattingService);

  private sideMenuService = inject(SideMenuService);

  public showSideMenu = computed(this.sideMenuService.isOpen);

  public messages = signal<Message[]>([]);
  #newMessageState = signal<State<String[]>>({
    data: [],
    loading: false,
  });

  public newMessage = computed(() => this.#newMessageState().data);
  public loading = computed(() => this.#newMessageState().loading);

  public sendMessage(chatId: string, message: String): void {
    this.#newMessageState().loading = true;

    this.chattingService
      .starChatting({
        chatId,
        message,
      })
      .subscribe(
        {
          next: response => {
            const partMessage = response.data.choices[0].response.content;
            if (!partMessage) return;
            this.#newMessageState().data.push(partMessage);
          },
          complete: () => this.#newMessageState().loading = false
        });
  }

}
