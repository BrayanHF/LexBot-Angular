import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public showPassword = signal(false);
  public showPasswordConfirm = signal(false);

  public form = this.fb.group({
      displayName: new FormControl("", [ Validators.required ]),
      email: new FormControl("", [ Validators.required, Validators.email ]),
      confirm_email: new FormControl("", [ Validators.required, Validators.email ]),
      password: new FormControl("", [ Validators.required, Validators.minLength(6) ]),
      confirm_password: new FormControl("", [ Validators.required ])
    },
    {
      validators: [
        this.matchFieldsValidator("email", "confirm_email", "emailMismatch"),
        this.matchFieldsValidator("password", "confirm_password", "passwordMismatch"),
      ]
    }
  )

  private matchFieldsValidator(field: string, confirmField: string, errorKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const fieldValue = group.get(field)?.value;
      const confirmValue = group.get(confirmField)?.value;

      if (fieldValue && confirmValue && fieldValue !== confirmValue) {
        group.get(confirmField)?.setErrors({ [errorKey]: true });
        return { [errorKey]: true };
      }

      return null;
    }
  }

  public onSubmit() {
    if (!this.isValidForm()) return;

    this.authService.register(
      this.form.value.displayName!,
      this.form.value.email!,
      this.form.value.password!
    ).subscribe(
      {
        next: user => {
          if (user) {
            void this.router.navigate([ '/chat' ]);
          }
        }
      });
  }

  private isValidForm(): boolean {
    return true;
  }

  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  public toggleShowPasswordConfirm(): void {
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

}
