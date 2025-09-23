import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = 'http://localhost:8080/messages';

  private http = inject(HttpClient);

  // todo: jwt
  public getMessages(chatId: string): Observable<LBApiResponse<Message[]>> {
    return this.http.get<LBApiResponse<Message[]>>(`${ this.baseUrl }/chat-id/${ chatId }`);
  }

}
