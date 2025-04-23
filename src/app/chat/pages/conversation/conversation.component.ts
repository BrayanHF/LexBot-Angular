import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, } from '@angular/core';
import { SideMenuService } from '../../../shared/services/side-menu.service';
import { ToggleSidemenuComponent } from '../../../shared/toggle-sidemenu/toggle-sidemenu.component';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { MessageListComponent } from "../../components/message-list/message-list.component";
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { Chat } from '../../interfaces/chat.interface';
import { Message } from '../../interfaces/message.interface';
import { State } from '../../interfaces/state.interface';
import { ChattingService } from '../../services/chatting.service';
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
  public messagesLoading = computed(() => this.#messagesState().loading);


  #newMessageState = signal<State<string[]>>({
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

    this.messageService.getMessages(chatId)
      .subscribe(
        {
          next: response => {
            const messages = response.data;
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
  }

  public sendMessage(textMessage: string): void {
    this.newMessageIsLoading(true);

    this.addMessage({ id: '', role: "user", text: textMessage });

    this.addMessage({ id: '', role: "assistant", text: '...' });

    this.chattingService
      .starChatting({
        chatId: this.chat().id,
        message: textMessage
      })
      .subscribe(
        {
          next: response => {

            const partMessage = response.data.aiChatResponse.choices[0].response.content;
            if (!partMessage) return;

            this.#newMessageState.update(state => ({ ...state, data: [ ...state.data, partMessage ] }));


            this.updateLastMessageInStream();

          },
          complete: () => this.newMessageIsLoading(false)
        });
  }

  private newMessageIsLoading(isLoading: boolean): void {
    this.#newMessageState.update(state => ({
      ...state,
      loading: isLoading
    }))
  }

  private addMessage(message: Message): void {
    this.#messagesState.update(state => ({
      ...state,
      data: [ ...state.data, message ]
    }));
  }

  private updateLastMessageInStream(): void {

    const generatedMessage = this.newMessage().join('');

    const currentMessage = this.#messagesState().data;
    const messages = [ ...currentMessage ];

    messages[messages.length - 1] = { ...messages[messages.length - 1], text: generatedMessage };


    this.#messagesState.update(state => ({ ...state, data: messages }));

  }


}
