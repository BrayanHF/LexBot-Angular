import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Chat } from '../../../conversation/interfaces/chat.interface';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ChatStateService } from '../../../conversation/services/chat-state.service';
import { DOCUMENT_GENERATORS, DocumentGeneratorType } from '../../types/document-generators';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';
import { ChatService } from '../../../conversation/services/chat.service';
import { State } from '../../../conversation/interfaces/state.interface';

@Component({
  selector: 'shared-sidemenu',
  imports: [ ToggleSidemenuComponent, RouterLink, RouterLinkActive ],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent {

  private router = inject(Router);
  private chatState = inject(ChatStateService);
  private chatService = inject(ChatService);

  private _stateChats = signal<State<Chat[]>>({
    data: [],
    loading: false
  });

  public allDocuments = Object.entries(DOCUMENT_GENERATORS).map(([ key, value ]) => ({
    key,
    value
  }));

  public chats = computed(() => this._stateChats().data);
  public loading = computed(() => this._stateChats().loading);

  constructor() {
    this.init();
  }

  private init(): void {
    this.loadChats();
    this.setupNewChatWatcher();
  }

  private setupNewChatWatcher(): void {
    effect(() => {
      const chatId = this.chatState.chatId();
      if (chatId == '') return;

      const ids = this.chats().map(chat => chat.id);

      if (!ids.includes(chatId)) {
        this.loadChats(false, () => this.navigateToChat(chatId));
      }
    });
  }

  private loadChats(showLoading: boolean = true, callback?: () => void): void {
    if (showLoading) this.setChatsLoading(true);

    this.chatService.getChats().subscribe({
      next: res => this._stateChats.update(s => ({ ...s, data: res.data })),
      complete: () => {
        if (showLoading) this.setChatsLoading(false);
        callback?.();
      },
      error: () => this.setChatsLoading(false)
    });
  }

  private setChatsLoading(loading: boolean): void {
    this._stateChats.update(s => ({ ...s, loading }));
  }

  private navigateToChat(id: string): void {
    void this.router.navigate([ `/chat/c/${ id }` ]);
  }

  public showOptions(): void {
    // TODO: implement this
  }

}

