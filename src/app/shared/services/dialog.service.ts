import { computed, Injectable, signal } from '@angular/core';
import { ConfigDialog } from '../interfaces/config-dialog.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private _title = signal("");
  private _message = signal("");
  private _action = signal(() => {});

  private _showConfirmBotton = signal(false);
  private _showCancelBotton = signal(false);
  private _showDeleteBotton = signal(false);

  public title = computed(() => this._title());
  public message = computed(() => this._message());
  public showConfirmBotton = computed(() => this._showConfirmBotton());
  public showCancelBotton = computed(() => this._showCancelBotton());
  public showDeleteBotton = computed(() => this._showDeleteBotton());

  public showDialog = signal(false);

  public onAction() {
    this._action()();
    this.clear();
  }

  public onCancel() {
    this.clear()
  }

  public configDialog(config: ConfigDialog) {
    this._title.set(config.title);
    this._message.set(config.message);
    this._action.set(config.action);
    this._showConfirmBotton.set(config.showConfirmBotton);
    this._showCancelBotton.set(config.showCancelBotton);
    this._showDeleteBotton.set(config.showDeleteBotton);
  }

  private clear(): void {
    this._title.set("");
    this._message.set("");
    this._action.set(() => {});
    this._showConfirmBotton.set(false);
    this._showCancelBotton.set(false);
    this._showDeleteBotton.set(false);
    this.showDialog.set(false);
  }

}
