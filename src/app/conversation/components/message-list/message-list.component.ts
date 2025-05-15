import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SideMenuService } from '../../../shared/services/side-menu.service';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'conversation-message-list',
  imports: [
    NgClass
  ],
  templateUrl: './message-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent {

  public messages = input.required<Message[]>();

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

}
