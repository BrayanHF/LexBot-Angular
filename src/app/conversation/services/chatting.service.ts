import { inject, Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { AIChatRequest } from '../interfaces/ai-chat-request.interface';
import { map, Observable, switchMap, takeWhile } from 'rxjs';
import { ChattingResponse } from '../interfaces/chatting-response.interface';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChattingService {

  private baseUrl = 'http://localhost:8080/chatting';
  private sseClient = inject(SseClient);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  private chattingRequest(
    isStream: boolean,
    chatRequest: AIChatRequest
  ): Observable<string> {

    const url = isStream ? `${ this.baseUrl }/stream` : this.baseUrl;

    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.sseClient
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
                'Authorization': 'Bearer ' + token,
              },
              body: chatRequest,
            },
            'POST'
          )
      )
    );
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

  public newChat(chatRequest: AIChatRequest): Observable<LBApiResponse<string>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post<LBApiResponse<string>>(
          `${ this.baseUrl }/newChat`,
          chatRequest,
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      )
    );
  }

}
