import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chat-message-input',
  imports: [],
  templateUrl: './message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {}
