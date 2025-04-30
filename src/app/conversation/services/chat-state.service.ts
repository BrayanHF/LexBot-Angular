import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {

  private _chatId = signal<string>('');
  public chatId = this._chatId.asReadonly();

  public setChatId(id: string) {
    this._chatId.set(id);
  }

}
