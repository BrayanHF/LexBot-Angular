import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidemenuComponent } from '../shared/sidemenu/sidemenu.component';
import ConversationComponent from './pages/conversation/conversation.component';

@Component({
  imports: [SidemenuComponent, ConversationComponent],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatComponent {}
