import { Chat } from '../../chat/interfaces/chat.interface';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';
import { ChatService } from '../../chat/services/chat.service';
import { State } from '../../chat/interfaces/state.interface';

@Component({
  selector: 'shared-sidemenu',
  imports: [ ToggleSidemenuComponent ],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {

  private chatService = inject(ChatService);

  public currentChat = signal<Chat>({
    id: '',
    title: '',
    lastUse: new Date()
  });

  public chatChange = output<Chat>();

  #stateChats = signal<State<Chat[]>>({
    data: [],
    loading: false
  });

  public chats = computed(() => this.#stateChats().data);
  public loading = computed(() => this.#stateChats().loading);

  ngOnInit(): void {
    this.getChats();
  }

  public getChats(): void {
    this.#stateChats.update(state => ({ ...state, loading: true }));

    this.chatService.getChats().subscribe({
      next: response => this.#stateChats.update(state => ({ ...state, data: response.data })),
      complete: () => this.#stateChats.update(state => ({ ...state, loading: false }))
    });
  }

  public changeChat(chat: Chat): void {
    console.log("will change")
    if (this.currentChat().id !== chat.id) {
      this.currentChat.set(chat);
      this.chatChange.emit(chat);
    }
  }

  public newChat(): void {
    const chat: Chat = {
      id: '',
      title: '',
      lastUse: new Date()
    };

    this.changeChat(chat);
  }

  public showOptions(): void {
    // todo: implement this
    console.log("this button has been clicked")
  }

}
