import { AfterViewInit, Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChatService } from '../../../conversation/services/chat.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'shared-chat-options-menu',
  imports: [
    NgIf
  ],
  templateUrl: './chat-options-menu.component.html',
})
export class ChatOptionsMenuComponent implements AfterViewInit {

  private elementRef = inject(ElementRef);
  private chatService = inject(ChatService);
  private dialogService = inject(DialogService);

  public trigger = input.required<HTMLElement>();
  public chatId = input.required<string>();
  public chatTitle = input.required<string>();

  public chatDeleted = output<string>();

  public visible = signal(false);
  public showAbove = signal(false);
  public triggerHeight = signal(0);


  ngAfterViewInit() {
    if (!this.trigger) return;

    const rect = this.trigger().getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBottom = viewportHeight - rect.bottom;
    const spaceTop = rect.top;

    this.showAbove.set(spaceBottom < 150 && spaceTop > spaceBottom);
    this.triggerHeight.set(rect.height);
    this.visible.set(true);
  }

  @HostListener('document:click', [ '$event' ])
  clickOutside(event: Event) {
    if (this.visible() && !this.elementRef.nativeElement.contains(event.target)) {
      this.visible.set(false);
    }
  }

  public deleteChat() {
    this.visible.set(false);

    this.dialogService.configDialog({
      title: "Eliminar chat",
      message: `¿Estás seguro de que quieres eliminar chat el chat con título "${ this.chatTitle() }"?
                \n\nEsta acción no se puede deshacer.`,
      showCancelBotton: true,
      showDeleteBotton: true,
      showConfirmBotton: false,
      action: () => {
        this.chatService.deleteChat(this.chatId()).subscribe(
          {
            next: apiResponse => {
              if (apiResponse.data) {
                this.chatDeleted.emit(this.chatId());
              }
            }
          }
        )
      }
    });

    this.dialogService.showDialog.set(true);

  }

}
