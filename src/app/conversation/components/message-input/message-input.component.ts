import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, output, ViewChild } from '@angular/core';
import { SideMenuService } from '../../../shared/services/side-menu.service';

@Component({
  selector: 'conversation-message-input',
  imports: [
    NgClass
  ],
  templateUrl: './message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

  messageToSend = output<string>()

  @ViewChild('messageInput') messageInput!: ElementRef;


  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const message: string = this.messageInput.nativeElement.innerText;
    this.messageToSend.emit(message);
    this.messageInput.nativeElement.innerText = '';
  }

}
