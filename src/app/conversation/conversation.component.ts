import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidemenuComponent } from '../shared/components/sidemenu/sidemenu.component';
import { SideMenuService } from '../shared/services/side-menu.service';

@Component({
  imports: [ SidemenuComponent, RouterOutlet, NgClass, HeaderComponent ],
  templateUrl: './conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConversationComponent {

  private bpo = inject(BreakpointObserver);
  public isMobile = signal<boolean>(false);

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen);

  constructor() {
    this.mobileObserver();
  }

  private mobileObserver(): void {
    this.bpo.observe([ Breakpoints.Handset ])
      .subscribe(
        res => this.isMobile.set(res.matches)
      );
  }

}
