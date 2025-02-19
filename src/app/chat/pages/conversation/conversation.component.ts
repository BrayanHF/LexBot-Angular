import { State } from './../../interfaces/state.interface';
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
import { Chat } from '../../interfaces/chat.interface';
import { ChattingService } from '../../services/chatting.service';
import { map } from 'rxjs';
import { MessageListComponent } from "../../components/message-list/message-list.component";

@Component({
  selector: 'chat-conversation',
  imports: [ToggleSidemenuComponent, UserMenuComponent, MessageInputComponent, MessageListComponent],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {


  private chattingService = inject(ChattingService);

  messages = signal<Message[]>([]);
  chat = signal<Chat>({
    id: 'test',
    title: '',
    lastUse: new Date(),
  });



  #newMessageState = signal<State<String[]>>({
    data: [],
    loading: false,
  });

  public message = computed(() => this.#newMessageState().data);
  public loading = computed(() => this.#newMessageState().loading);



  public sendMessage(message: String): void {
    this.#newMessageState().loading = true;

    this.chattingService
      .starChatting({
        chatId: this.chat().id,
        message,
      })
      .subscribe((response) => {
        const partMessage = response.data.choices[0].response.content;
        if (!partMessage) return;
        this.#newMessageState().data.push(partMessage);
      });
  }
}
