import { Component, inject } from '@angular/core';
import { last, tap } from "rxjs";
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { ChatStateService } from "../../services/chat-state.service";
import { ChattingService } from "../../services/chatting.service";

@Component({
  selector: 'conversation-new-chat',
  imports: [
    MessageInputComponent,
  ],
  templateUrl: './new-chat.component.html',
})
export default class NewChatComponent {

  private chattingService = inject(ChattingService);
  private chatState = inject(ChatStateService);

  public startNewChatWithMessage(text: string): void {
    const message = {
      chatId: '',
      message: text
    };

    this.chattingService.starChatting(message)
      .pipe(
        last(),
        tap(res => this.chatState.setChatId(res.data.chatId))
      )
      .subscribe({
        error: err => console.error('Error al iniciar el chat:', err)
      });
  }
}

