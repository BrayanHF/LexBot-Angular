import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { HabeasDataRequest } from '../interfaces/habeas-data-request.interface';
import { QuestionAnswer } from '../interfaces/question-answer.interface';
import { RightPetitionRequest } from '../interfaces/right-petition-request.interface';
import { SpecialPowerRequest } from '../interfaces/special-power-request.interface';
import { ValidatedAnswer } from '../interfaces/validated-answer.interface';
import { ComplaintRequest } from '../interfaces/complaint-request.interface';

@Injectable({
  providedIn: 'root'
})
export class GenerateDocumentService {

  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/generate';
  private readonly baseUrlValidate = this.baseUrl + '/validate-answer';

  public validateAnswer(questionAnswer: QuestionAnswer, type: DocumentGeneratorType): Observable<ValidatedAnswer> {
    return this.http.post<ValidatedAnswer>(`${ this.baseUrlValidate }/${ type }`, questionAnswer);
  }

  public generateRightPetitionPDF(rpRequest: RightPetitionRequest): Observable<Blob> {
    return this.http.post(`${ this.baseUrl }/right-petition`, rpRequest, { responseType: "blob" });
  }

  public generateComplaintPDF(complaintRequest: ComplaintRequest): Observable<Blob> {
    return this.http.post(`${ this.baseUrl }/complaint`, complaintRequest, { responseType: "blob" });
  }

  public generateSpecialPowerPDF(spRequest: SpecialPowerRequest): Observable<Blob> {
    return this.http.post(`${ this.baseUrl }/power-of-attorney`, spRequest, { responseType: "blob" });
  }

  public generateHabeasDataPDF(hdRequest: HabeasDataRequest): Observable<Blob> {
    return this.http.post(`${ this.baseUrl }/habeas-data`, hdRequest, { responseType: "blob" });
  }

}
