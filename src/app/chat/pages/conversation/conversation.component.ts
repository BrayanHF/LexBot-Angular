import { Chat } from '../../interfaces/chat.interface';
import { State } from '../../interfaces/state.interface';
import {
  ChangeDetectionStrategy,
  Component,
  computed, effect,
  inject, input,
  signal,
} from '@angular/core';
import { ToggleSidemenuComponent } from '../../../shared/toggle-sidemenu/toggle-sidemenu.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { Message } from '../../interfaces/message.interface';
import { ChattingService } from '../../services/chatting.service';
import { MessageListComponent } from "../../components/message-list/message-list.component";
import { SideMenuService } from '../../../shared/services/side-menu.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'chat-conversation',
  imports: [ ToggleSidemenuComponent, UserMenuComponent, MessageInputComponent, MessageListComponent ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

  private chattingService = inject(ChattingService);
  private messageService = inject(MessageService);

  public chat = input.required<Chat>();

  #messagesState = signal<State<Message[]>>({
    data: [],
    loading: false,
  });
  public messages = computed(() => this.#messagesState().data);
  public messagesLoading = computed(() => this.#messagesState().data);


  #newMessageState = signal<State<String[]>>({
    data: [],
    loading: false,
  });
  public newMessage = computed(() => this.#newMessageState().data);
  public newMessageLoading = computed(() => this.#newMessageState().loading);

  constructor() {
    effect(() => {
      if (this.chat().id !== '') this.getMessages(this.chat().id);

      if (this.chat().id === '') this.newChat();
    });
  }

  public getMessages(chatId: string): void {
    this.#messagesState.update(state => ({ ...state, loading: true }));
    console.log("getting message for chat: ", chatId);

    this.messageService.getMessages(chatId)
      .subscribe(
        {
          next: response => {
            const messages = response.data;
            console.log(response)
            this.#messagesState.update(state => ({ ...state, data: messages }));
          },
          complete: () => this.#messagesState.update(state => ({ ...state, loading: false }))
        }
      );
  }

  public newChat(): void {
    this.#messagesState.set({
      data: [],
      loading: false,
    });
    console.log('this is for a new chat')
  }

  public sendMessage(message: String): void {
    this.#newMessageState.update(state => ({ ...state, loading: true }))

    this.chattingService
      .starChatting({
        chatId: this.chat().id,
        message: message
      })
      .subscribe(
        {
          next: response => {
            const partMessage = response.data.aiChatResponse.choices[0].response.content;
            if (!partMessage) return;
            this.#newMessageState.update(state => ({ ...state, data: [ ...state.data, partMessage ] }));
          },
          complete: () => this.#newMessageState.update(state => ({ ...state, loading: false }))
        });
  }

}
