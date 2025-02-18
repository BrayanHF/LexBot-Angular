import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chat-message',
  imports: [],
  templateUrl: './message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {}
