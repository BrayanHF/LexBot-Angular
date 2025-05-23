import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserMenuComponent } from '../../../conversation/components/user-menu/user-menu.component';
import { SideMenuService } from '../../services/side-menu.service';
import { DOCUMENT_GENERATORS } from '../../types/document-generators';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';

@Component({
  selector: 'shared-header',
  imports: [
    NgClass,
    ToggleSidemenuComponent,
    UserMenuComponent,
    NgIf
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  private bpo = inject(BreakpointObserver);
  public isMobile = signal<boolean>(false);

  private sideMenuService = inject(SideMenuService);
  public showSideMenu = computed(this.sideMenuService.isOpen)

  public title = inject(Title);
  public document_labels: string[] = Object.values(DOCUMENT_GENERATORS).map(gen => gen.label);

  constructor() {
    this.mobileObserver();
  }

  private mobileObserver(): void {
    this.bpo.observe([ '(max-width: 767px)' ])
      .subscribe(
        res => this.isMobile.set(res.matches)
      );
  }

}
