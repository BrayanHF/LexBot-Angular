import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { SideMenuService } from '../../services/side-menu.service';

@Component({
  selector: 'shared-toggle-sidemenu',
  imports: [],
  templateUrl: './toggle-sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSidemenuComponent {

  private sideMenuService = inject(SideMenuService);

  public toggleSideMenu(): void {
    this.sideMenuService.toggleSideMenu();
  }

}
