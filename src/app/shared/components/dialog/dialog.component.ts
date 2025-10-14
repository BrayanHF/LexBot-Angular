import { Component, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'shared-dialog',
  imports: [
    NgIf
  ],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {

  public dialogService = inject(DialogService);

}
