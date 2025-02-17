import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shared-sidemenu',
  imports: [],
  templateUrl: './sidemenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent {}
