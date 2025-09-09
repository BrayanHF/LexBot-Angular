import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink
  ],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {

  private fb = inject(FormBuilder);

  public form = this.fb.group({
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required]),
    confirm_email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    confirm_password: new FormControl("", [Validators.required])
  })

}
