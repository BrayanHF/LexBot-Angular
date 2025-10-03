import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject, OnDestroy,
  output,
  ViewChild
} from '@angular/core';
import { SideMenuService } from '../../../shared/services/side-menu.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'conversation-message-input',
  imports: [
    NgClass
  ],
  templateUrl: './message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent implements AfterViewInit, OnDestroy {

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

  private route = inject(ActivatedRoute);
  private sub!: Subscription;

  public messageToSend = output<string>()

  @ViewChild('messageInput') messageInput!: ElementRef;

  ngAfterViewInit(): void {
    if (window.location.pathname.includes('/chat/c/') || window.location.pathname.endsWith('chat')) {
      this.focusInput();
    }

    this.sub = this.route.paramMap.subscribe(params => {
      this.clearInput();
    });
  }

  ngOnDestroy(): void {
    this.clearInput();
    this.sub?.unsubscribe();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  public sendMessage(): void {
    const message: string = this.messageInput.nativeElement.innerText;
    this.messageToSend.emit(message);
    this.messageInput.nativeElement.innerText = '';
  }

  public focusInput() {
    this.messageInput.nativeElement.focus();
  }

  private clearInput() {
    this.messageInput.nativeElement.innerText = '';
  }

}
