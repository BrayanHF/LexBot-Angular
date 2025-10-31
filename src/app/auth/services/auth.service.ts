import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LBApiResponse } from '../../conversation/interfaces/lb-api-response.interface';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${ environment.lbUrl }/user`;

  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
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

  public logout() {
    return from(this.auth.signOut()).subscribe(
      () => void this.router.navigate([ '/auth/login' ])
    )
  }

  public currentIdToken$() {
    return this.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return from(user.getIdToken());
        } else {
          return from([ "" ]);
        }
      })
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
