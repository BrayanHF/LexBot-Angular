import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chat-conversation',
  imports: [],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {}
