import { inject, Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { AIChatRequest } from '../interfaces/ai-chat-request.interface';
import { map, Observable, takeWhile } from 'rxjs';
import { ChattingResponse } from '../interfaces/chatting-response.interface';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';

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

    const url = isStream ? `${ this.baseUrl }/stream` : this.baseUrl;
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
  ): Observable<LBApiResponse<ChattingResponse>> {
    return this.chattingRequest(true, chatRequest)
      .pipe(
        map(
          response => JSON.parse(response) as LBApiResponse<ChattingResponse>
        ),
        takeWhile(
          response => response.data.aiChatResponse.choices[0].finish_reason === null,
          true // Emit the last value
        )
      );
  }

}
