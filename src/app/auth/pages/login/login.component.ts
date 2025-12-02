import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../../../shared/services/notification.service';
import { FirebaseError } from 'firebase/app';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
})
export default class LoginComponent {

  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public showPassword = signal(false);

  public form = this.fb.group({
      email: new FormControl("", [ Validators.required, Validators.email ]),
      password: new FormControl("", [ Validators.required ])
    }
  )

  public onLogin() {
    if (!this.isValidForm()) return;

    this.authService.login(
      this.form.value.email!,
      this.form.value.password!
    ).subscribe(
      {
        next: user => {
          if (user) {
            void this.router.navigate([ '/chat' ]);
          }
        },
        error: (error: FirebaseError) => {
          this.notificationService.error(
            "Error",
            this.getOnLoginErrorMessage(error.code)
          );
          this.form.patchValue({ password: '' });
          this.form.get('password')?.markAsPristine();
          this.form.get('password')?.markAsUntouched();
        }
      }
    );
  }

  public onGoogleLogin() {
    this.authService.loginWithGoogle()
      .subscribe(
        {
          next: user => {
            if (user) {
              void this.router.navigate([ '/chat' ]);
            }
          },
          error: (error: FirebaseError | HttpErrorResponse) => {
            this.handleOnGoogleLoginError(error);
          }
        }
      );
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  private handleOnGoogleLoginError(error: FirebaseError | HttpErrorResponse) {
    if ("code" in error) {
      this.notificationService.error(
        "Error de Google",
        this.getOnGoogleErrorMessage(error.code)
      );
      return;
    }

    this.notificationService.error(
      "Error inesperado",
      "Algo salió mal, intenta de nuevo."
    );
    this.authService.logout();
  }

  private getOnLoginErrorMessage(code: string): string {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Correo o contraseña incorrectos."
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta más tarde."
      case "auth/network-request-failed":
        return "Error de red. Verifica tu conexión."
      default:
        return "Error inesperado al iniciar sesión"
    }
  }

  private getOnGoogleErrorMessage(code: string): string {
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Se cerró la ventana de Google antes de completar el inicio.";
      case "auth/network-request-failed":
        return "Error de conexión. Revisa tu red.";
      case "auth/cancelled-popup-request":
        return "Ya hay otra ventana de Google abierta.";
      default:
        return "No se pudo iniciar sesión con Google.";
    }
  }

  public toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

}
