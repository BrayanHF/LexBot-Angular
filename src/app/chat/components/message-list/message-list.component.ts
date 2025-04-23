import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'chat-message-list',
  imports: [
    NgClass
  ],
  templateUrl: './message-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent {

  public messages = input.required<Message[]>();

}
