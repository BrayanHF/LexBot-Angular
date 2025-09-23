import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
})
export default class LoginComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public form = this.fb.group({
      email: new FormControl("", [ Validators.required, Validators.email ]),
      password: new FormControl("", [ Validators.required ])
    }
  )

  public onSubmit() {
    if (!this.isValidForm()) return;

    console.log(this.form.value.email!);
    console.log(this.form.value.password!);

    this.authService.login(
      this.form.value.email!,
      this.form.value.password!
    ).subscribe();
  }

  private isValidForm(): boolean {
    return true;
  }

}
