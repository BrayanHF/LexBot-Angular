import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidemenuComponent } from '../shared/components/sidemenu/sidemenu.component';
import { SideMenuService } from '../shared/services/side-menu.service';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DialogService } from '../shared/services/dialog.service';

@Component({
  imports: [ SidemenuComponent, RouterOutlet, NgClass, HeaderComponent, DialogComponent, NgIf ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private sideMenuService = inject(SideMenuService);
  private dialogService = inject(DialogService);
  public showSideMenu = computed(this.sideMenuService.isOpen);
  public showDialog = computed(this.dialogService.showDialog);

}
