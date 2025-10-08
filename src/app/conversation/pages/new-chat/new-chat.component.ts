import { Component, inject } from '@angular/core';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { ChattingService } from "../../services/chatting.service";
import { Router } from '@angular/router';

@Component({
  selector: 'conversation-new-chat',
  imports: [
    MessageInputComponent,
  ],
  templateUrl: './new-chat.component.html',
})
export default class NewChatComponent {

  private chattingService = inject(ChattingService);
  private router = inject(Router);

  public startNewChatWithMessage(userMessage: string): void {
    const message = {
      chatId: '',
      message: userMessage
    };

    this.chattingService.newChat(message).subscribe({
      next: response => {
        const newChatId = response.data;
        void this.router.navigate(
          [ `chat/c/${ newChatId }` ],
          { queryParams: { message: userMessage } }
        );
      }
    });
  }
}

