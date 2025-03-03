import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { Chat } from '../interfaces/chat.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private baseUrl = 'http://localhost:8080/chat';

  private http = inject(HttpClient);

  // todo: Implement JWT and headers for authentication for all requests

  public getChats(): Observable<LBApiResponse<Chat[]>> {
    return this.http.get<LBApiResponse<Chat[]>>(this.baseUrl);
  }

  public getChatById(chatId: string): Observable<LBApiResponse<Chat>> {
    return this.http.get<LBApiResponse<Chat>>(`${ this.baseUrl }/chat-id/${ chatId }`);
  }

  public updateChat(
    chatId: string,
    updates: Map<string, Object>
  ): Observable<LBApiResponse<Map<string, Object>>> {
    return this.http.put<LBApiResponse<Map<string, Object>>>(this.baseUrl, { chatId, updates });
  }

  public deleteChat(chatId: string): Observable<LBApiResponse<String>> {
    return this.http.delete<LBApiResponse<String>>(`${ this.baseUrl }/chat-id/${ chatId }`);
  }

}
