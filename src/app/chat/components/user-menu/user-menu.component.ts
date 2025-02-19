import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chat-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent { }
