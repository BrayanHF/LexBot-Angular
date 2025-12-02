import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { HabeasDataRequest } from '../interfaces/habeas-data-request.interface';
import { QuestionAnswer } from '../interfaces/question-answer.interface';
import { RightPetitionRequest } from '../interfaces/right-petition-request.interface';
import { SpecialPowerRequest } from '../interfaces/special-power-request.interface';
import { ValidatedAnswer } from '../interfaces/validated-answer.interface';
import { ComplaintRequest } from '../interfaces/complaint-request.interface';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GenerateDocumentService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = `${ environment.lbUrl }/generate`;
  private readonly baseUrlValidate = this.baseUrl + '/validate-answer';

  public validateAnswer(questionAnswer: QuestionAnswer, type: DocumentGeneratorType): Observable<ValidatedAnswer> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post<ValidatedAnswer>(
          `${ this.baseUrlValidate }/${ type }`,
          questionAnswer,
          { headers: { Authorization: 'Bearer ' + token } }
        )
      )
    );
  }

  public generateRightPetitionPDF(rpRequest: RightPetitionRequest): Observable<Blob> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post(
          `${ this.baseUrl }/right-petition`,
          rpRequest,
          {
            responseType: "blob",
            headers: { Authorization: 'Bearer ' + token }
          }
        )
      )
    );
  }

  public generateComplaintPDF(complaintRequest: ComplaintRequest): Observable<Blob> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post(
          `${ this.baseUrl }/complaint`,
          complaintRequest,
          {
            responseType: "blob",
            headers: { Authorization: 'Bearer ' + token }
          }
        )
      )
    );
  }

  public generateSpecialPowerPDF(spRequest: SpecialPowerRequest): Observable<Blob> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post(
          `${ this.baseUrl }/power-of-attorney`,
          spRequest,
          {
            responseType: "blob",
            headers: { Authorization: 'Bearer ' + token }
          }
        )
      )
    );
  }

  public generateHabeasDataPDF(hdRequest: HabeasDataRequest): Observable<Blob> {
    return this.authService.currentIdToken$().pipe(
      switchMap(token =>
        this.http.post(
          `${ this.baseUrl }/habeas-data`,
          hdRequest,
          {
            responseType: "blob",
            headers: { Authorization: 'Bearer ' + token }
          }
        )
      )
    );
  }

}
