import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Chat } from '../../../conversation/interfaces/chat.interface';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ChatStateService } from '../../../conversation/services/chat-state.service';
import { DOCUMENT_GENERATORS } from '../../types/document-generators';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';
import { ChatService } from '../../../conversation/services/chat.service';
import { State } from '../../../conversation/interfaces/state.interface';
import { take } from 'rxjs';
import { DeviceService } from '../../services/device.service';
import { SideMenuService } from '../../services/side-menu.service';
import { ChatOptionsMenuComponent } from '../chat-options-menu/chat-options-menu.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'shared-sidemenu',
  imports: [ ToggleSidemenuComponent, RouterLink, RouterLinkActive, ChatOptionsMenuComponent, NgIf ],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent {

  private chatState = inject(ChatStateService);
  private chatService = inject(ChatService);
  private deviceService = inject(DeviceService);
  private sideMenuService = inject(SideMenuService);
  private router = inject(Router);

  private isMobile = this.deviceService.isMobile;

  public openOptionsId = signal<string | null>(null);

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
        this.loadChats(false);
      }
    });
  }

  private loadChats(showLoading: boolean = true): void {
    if (showLoading) this.setChatsLoading(true);

    this.chatService.getChats().pipe(take(1)).subscribe({
      next: res => {
        const sorted = res.data
          .map(chat => ({
            ...chat,
            lastUse: new Date(chat.lastUse)
          }))
          .sort((a, b) => b.lastUse.getTime() - a.lastUse.getTime());

        this._stateChats.update(s => ({ ...s, data: sorted }));
      },
      complete: () => {
        if (showLoading) this.setChatsLoading(false);
      },
      error: () => this.setChatsLoading(false)
    });
  }

  public onChatDeleted(deletedChatId: string): void {
    const currentChatId = this.chatState.chatId();

    if (deletedChatId === currentChatId) {
      this.chatState.setChatId('');
      void this.router.navigate([ '/chat' ]);
    }
    this.loadChats(false);
  }


  private setChatsLoading(loading: boolean): void {
    this._stateChats.update(s => ({ ...s, loading }));
  }

  public autoCloseInMobile() {
    if (this.isMobile() && this.sideMenuService.isOpen()) {
      this.sideMenuService.toggleSideMenu();
    }
  }

  public showOptions(chatId: string): void {
    this.openOptionsId.set(this.openOptionsId() === chatId ? null : chatId);
  }

  public isOptionOpen(chatId: string) {
    return this.openOptionsId() === chatId;
  }

}

