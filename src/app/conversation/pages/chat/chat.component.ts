import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, distinctUntilChanged, filter, finalize, firstValueFrom, map, tap } from 'rxjs';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { MessageListComponent } from "../../components/message-list/message-list.component";
import { ChattingResponse } from '../../interfaces/chatting-response.interface';
import { LBApiResponse } from '../../interfaces/lb-api-response.interface';
import { Message } from '../../interfaces/message.interface';
import { State } from '../../interfaces/state.interface';
import { ChattingService } from '../../services/chatting.service';
import { MessageService } from '../../services/message.service';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'conversation-chat',
  imports: [ MessageListComponent, MessageInputComponent ],
  templateUrl: './chat.component.html',
  styles: [ `
    .pb-dynamic {
      padding-bottom: var(--pb);
    }
  ` ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatComponent implements AfterViewInit, OnDestroy {

  @ViewChild('messageInput') messageInput!: MessageInputComponent;
  @ViewChild('messageList', { read: ElementRef }) messageList!: ElementRef<HTMLDivElement>;

  private resizeObserver!: ResizeObserver;
  private autoScrollEnabled = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chattingService = inject(ChattingService);
  private messageService = inject(MessageService);
  private chatState = inject(ChatStateService);

  private chatId = signal('');

  private _messagesState = signal<State<Message[]>>({
    data: [],
    loading: false,
  });
  public messages = computed(() => this._messagesState().data ?? []);
  public messagesLoading = computed(() => this._messagesState().loading);

  private _newMessageState = signal<State<string[]>>({
    data: [],
    loading: false,
  });
  public newMessage = computed(() => this._newMessageState().data);
  public newMessageLoading = computed(() => this._newMessageState().loading);

  async ngAfterViewInit() {
    const element = this.messageInput.messageInput.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {
      const height = element.offsetHeight;
      document.documentElement.style.setProperty('--pb', `${ height + 96 }px`);
    });

    this.resizeObserver.observe(element);

    const [ params, queryParams ] = await firstValueFrom(
      combineLatest([
        this.route.params.pipe(filter(p => !!p['chatId'])),
        this.route.queryParams
      ])
    );

    const id = params['chatId'];
    const message = queryParams['message'];

    this.chatId.set(id);

    if (message) {
      this.sendMessage(
        message,
        () => {
          this.chatState.setChatId(this.chatId());
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
        }
      );
    } else {
      this.getMessages();
    }

    this.route.params
      .pipe(
        map(params => params['chatId']),
        filter((id): id is string => !!id),
        distinctUntilChanged(),
        tap(id => {
          if (id !== this.chatId()) {
            this.chatId.set(id);
            this._messagesState.set({ data: [], loading: false });
            this.getMessages();
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private getMessages(): void {
    this.messagesAreLoading(true);

    this.messageService
      .getMessages(this.chatId())
      .subscribe(
        {
          next: response => {
            const messages = response.data;
            this._messagesState.update(state => ({ ...state, data: messages }));
          },
          complete: () => this.messagesAreLoading(false)
        }
      );
  }

  private previousScrollTop: number = 0;

  public onUserScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const currentScrollTop = target.scrollTop;

    if (currentScrollTop < this.previousScrollTop) {
      this.autoScrollEnabled = false;
    }

    this.previousScrollTop = currentScrollTop;
  }


  private scrollToBottom(): void {
    if (this.autoScrollEnabled) {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    }
  }

  public sendMessage(userMessage: string, callback?: () => void): void {
    this.autoScrollEnabled = true;
    this.newMessageIsLoading(true);
    this.addUserAndPlaceholder({ id: "", text: userMessage, role: "user" }, { id: "", text: "...", role: "assistant" });
    this.scrollToBottom();

    this.chattingService
      .starChatting({ chatId: this.chatId(), message: userMessage })
      .pipe(
        tap(res => this.handleAssistantResponse(res)),
        finalize(() => {
          this.newMessageIsLoading(false);
          this._newMessageState.update(state => ({ ...state, data: [] }));
          this.scrollToBottom();
          callback?.();
        })
      ).subscribe();
  }

  private handleAssistantResponse(res: LBApiResponse<ChattingResponse>): void {
    const partMessage = res.data.aiChatResponse.choices[0].response.content;
    if (!partMessage) return;

    this._newMessageState.update(state => ({ ...state, data: [ ...state.data, partMessage ] }));
    this.updateLastMessageInStream();
    this.scrollToBottom();
  }

  private newMessageIsLoading(loading: boolean): void {
    this._newMessageState.update(state => ({
      ...state,
      loading
    }))
  }

  private messagesAreLoading(loading: boolean): void {
    this._messagesState.update(state => ({
      ...state,
      loading
    }));
  }

  private addUserAndPlaceholder(userMessage: Message, placeholder: Message): void {
    this._messagesState.update(state => ({
      ...state,
      data: [ ...(state.data ?? []), userMessage, placeholder ]
    }));
  }

  private updateLastMessageInStream(): void {
    const generatedMessage = this.newMessage().join('');

    const currentMessages = this._messagesState().data;

    const messages = [ ...currentMessages ];
    const lastIndex = messages.length - 1;

    messages[lastIndex] = { ...messages[lastIndex], text: generatedMessage };

    this._messagesState.update(state => ({ ...state, data: messages }));
  }

}
