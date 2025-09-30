import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { Chat } from '../interfaces/chat.interface';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private baseUrl = 'http://localhost:8080/chat';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public getChats(): Observable<LBApiResponse<Chat[]>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token => {
        return this.http.get<LBApiResponse<Chat[]>>(
          this.baseUrl,
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      })
    );
  }

  public getChatById(chatId: string): Observable<LBApiResponse<Chat>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.get<LBApiResponse<Chat>>(
          `${ this.baseUrl }/chat-id/${ chatId }`,
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      )
    );
  }

  public updateChat(
    chatId: string,
    updates: Map<string, Object>
  ): Observable<LBApiResponse<Map<string, Object>>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token => this.http.put<LBApiResponse<Map<string, Object>>>(
          this.baseUrl,
          { chatId, updates },
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      )
    );
  }

  public deleteChat(chatId: string): Observable<LBApiResponse<String>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token => this.http.delete<LBApiResponse<String>>(
          `${ this.baseUrl }/chat-id/${ chatId }`,
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      )
    );
  }

}
