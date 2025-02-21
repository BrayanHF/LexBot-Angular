import { Chat } from './../../chat/interfaces/chat.interface';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';
import { ignoreElements } from 'rxjs';
import { ChatService } from '../../chat/services/chat.service';
import { State } from '../../chat/interfaces/state.interface';
import { SideMenuService } from '../services/side-menu.service';

@Component({
  selector: 'shared-sidemenu',
  imports: [ToggleSidemenuComponent],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {

  private chatService = inject(ChatService);

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

}
