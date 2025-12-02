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
import { NotificationService } from '../../../shared/services/notification.service';
import { FirebaseError } from 'firebase/app';
import { HttpErrorResponse } from '@angular/common/http';

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

  private notificationService = inject(NotificationService);
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

  public onRegister() {
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
        },
        error: (error: FirebaseError | HttpErrorResponse) => {
          this.handleOnRegisterError(error);
        }
      });
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  private handleOnRegisterError(error: FirebaseError | HttpErrorResponse) {
    if ("code" in error) {
      this.notificationService.error(
        "Error al registrarse",
        this.getOnRegisterErrorMessage(error.code)
      );
      return;
    }

    this.notificationService.error(
      "Error inesperado",
      "No pudimos completar el registro, intenta de nuevo."
    );
  }

  private getOnRegisterErrorMessage(code: string): string {
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo ya está registrado.";
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/weak-password":
        return "La contraseña es demasiado débil. Usa una más segura.";
      case "auth/network-request-failed":
        return "Error de red. Revisa tu conexión.";
      case "auth/operation-not-allowed":
        return "El registro con email está deshabilitado.";
      default:
        return "No se pudo completar el registro.";
    }
  }

  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  public toggleShowPasswordConfirm(): void {
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

}
