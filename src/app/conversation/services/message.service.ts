import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { LBApiResponse } from '../interfaces/lb-api-response.interface';
import { Message } from '../interfaces/message.interface';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = `${ environment.lbUrl }/messages`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public getMessages(chatId: string): Observable<LBApiResponse<Message[]>> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.get<LBApiResponse<Message[]>>(
          `${ this.baseUrl }/chat-id/${ chatId }`,
          { headers: { Authorization: `Bearer ${ token }` } }
        )
      )
    );
  }

}
