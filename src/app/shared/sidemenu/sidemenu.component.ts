import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleSidemenuComponent } from '../toggle-sidemenu/toggle-sidemenu.component';

@Component({
  selector: 'shared-sidemenu',
  imports: [ToggleSidemenuComponent],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent {}
