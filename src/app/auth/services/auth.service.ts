import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, filter, from, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LBApiResponse } from '../../conversation/interfaces/lb-api-response.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = 'http://localhost:8080/user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  public readonly userLoggedIn$ = this.currentUser.pipe(
    filter((user): user is User => !!user)
  );

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);

      console.log(user);

      if (user) {
        if (this.router.url.startsWith('/auth')) {
          void this.router.navigate([ '/chat' ]);
        }
      } else {
        if (!this.router.url.startsWith('/auth')) {
          void this.router.navigate([ '/auth/login' ]);
        }
      }
    });
  }

  public login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  public register(displayName: string, email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        switchMap(userCredential =>
          from(updateProfile(userCredential.user, { displayName: displayName }))
            .pipe(switchMap(() => from([ userCredential.user ])))
        ),
        switchMap(user =>
          from(user.getIdToken()).pipe(
            switchMap(idToken => this.addNewUser(email, displayName, idToken))
          )
        )
      );
  }

  private addNewUser(email: string, displayName: string, idToken: string) {
    return this.http.post<LBApiResponse<boolean>>(
      `${ this.baseUrl }/new`,
      { email: email, displayName: displayName },
      { headers: { Authorization: `Bearer ${ idToken }` } }
    );
  }

}
