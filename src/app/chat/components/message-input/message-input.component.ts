import { ChangeDetectionStrategy, Component, ElementRef, output, ViewChild } from '@angular/core';

@Component({
  selector: 'chat-message-input',
  imports: [],
  templateUrl: './message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {

  messageToSend = output<string>()

  @ViewChild('messageInput') messageInput!: ElementRef;

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const message: string = this.messageInput.nativeElement.innerText;
    this.messageToSend.emit(message);
    this.messageInput.nativeElement.innerText = '';
  }

}
