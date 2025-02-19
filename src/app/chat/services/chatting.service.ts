import { inject, Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { AIChatRequest } from '../interfaces/ai-chat-request.interface';
import { map, Observable, takeWhile } from 'rxjs';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { AIChatResponse } from '../interfaces/ai-chat-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ChattingService {

  private baseUrl = 'http://localhost:8080/chatting';

  private sseClient = inject(SseClient);

  private chattingRequest(
    isStream: boolean,
    chatRequest: AIChatRequest
  ): Observable<string> {

    // todo: Implement JWT

    const url = isStream ? `${this.baseUrl}/stream` : this.baseUrl;
    return this.sseClient
      .stream(
        url,
        {
          keepAlive: false,
          reconnectionDelay: 0,
          responseType: 'text',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: chatRequest,
        },
        'POST'
      )
  }

  public starChatting(
    chatRequest: AIChatRequest
  ): Observable<LBApiResponse<AIChatResponse>> {
    return this.chattingRequest(true, chatRequest)
      .pipe(
        map(
          response => JSON.parse(response) as LBApiResponse<AIChatResponse>
        ),
        takeWhile(
          response => response.data.choices[0].finish_reason === null,
          true // Emit the last value
        )
      );
  }

}
