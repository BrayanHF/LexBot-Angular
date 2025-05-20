import { HttpClient } from '@angular/common/http';

import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentIDType } from '../../conversation/enum/document-id-type.enum';
import { AIChatResponse } from '../../conversation/interfaces/ai-chat-response.interface';
import { Message } from '../../conversation/interfaces/message.interface';
import { DocumentId } from '../interfaces/document-id.interface';
import { QuestionAnswer } from '../interfaces/question-answer.interface';
import { RightPetitionRequest } from '../interfaces/right-petition-request.interface';
import { ValidatedAnswer } from '../interfaces/validated-answer.interface';
import { cityAndDate, getDocumentAbbreviation, titleCase } from './helper';
import { JsPdfService } from './js-pdf.service';

@Injectable({
  providedIn: 'root',
})
export class RightPetitionService {

  private http = inject(HttpClient);
  private jsPdfService = inject(JsPdfService);

  private readonly baseUrl = 'http://localhost:8080/generate';

  public pdfName = signal<string | null>(null);
  public messages = signal<Message[]>([]);

  private document: DocumentId | null = null;
  private currentQuestionIndex = 0;
  private answers: string[] = [];

  private readonly questionsRP: string[] = [
    "¿Cuál es el lugar de expedición de tu documento?",
    "¿Cuál es tu nombre completo?",
    "¿Cuál es tu número de teléfono de contacto?",
    "¿Cuál es tu correo electrónico para que te notifiquen?",
    "¿En qué ciudad estás presentando esta petición?",
    "¿Cuál es la dirección de tu casa o dónde quieres que te respondan?",
    "¿A qué entidad, autoridad o persona vas a dirigir tu petición?",
    "Describe todos los hechos o detalles que motivan tu solicitud.",
    "¿Qué exactamente solicitas (petición concreta)?"
  ];


  public start(document: DocumentId): void {
    this.document = document;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.messages.set([]);

    this.pushAssistantMessage(this.questionsRP[0]);
  }

  public handleUserMessage(userAnswer: string): void {
    if (!this.document || this.currentQuestionIndex >= this.questionsRP.length) return;

    const currentQuestion = this.questionsRP[this.currentQuestionIndex];

    this.pushUserMessage(userAnswer);

    if (this.currentQuestionIndex === 8) {
      userAnswer = "Hechos: " + this.answers[7] + "\nPeticiones: " + userAnswer;
    }

    this.validateAnswer({ question: currentQuestion, answer: userAnswer }).subscribe({
      next: (validation) => {
        if (validation.error) {
          this.pushAssistantMessage(validation.error);
          return;
        }

        this.answers.push(validation.result ?? userAnswer);
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questionsRP.length) {
          this.pushAssistantMessage(this.questionsRP[this.currentQuestionIndex]);
        } else {
          this.generateRightPetition();
        }
      },
      error: () => {
        this.pushAssistantMessage('Hubo un error al validar tu respuesta. Intenta de nuevo más tarde.');
      }
    });
  }

  public validateDocument(document: DocumentId): DocumentId {
    const trimmed = document.number.trim();
    const type = document.type;

    const validations: Record<DocumentIDType, { regex: RegExp; error: string }> = {
      [DocumentIDType.CedulaCiudadania]: {
        regex: /^\d{7,10}$/,
        error: 'Debe contener solo números entre 7 y 10 dígitos.',
      },
      [DocumentIDType.TarjetaIdentidad]: {
        regex: /^\d{7,10}$/,
        error: 'Debe contener solo números entre 7 y 10 dígitos.',
      },
      [DocumentIDType.CedulaExtranjeria]: {
        regex: /^[A-Za-z0-9]{7,12}$/,
        error: 'Debe contener entre 7 y 12 caracteres alfanuméricos.',
      },
      [DocumentIDType.Pasaporte]: {
        regex: /^[A-Za-z0-9]{6,9}$/,
        error: 'Debe contener entre 6 y 9 caracteres alfanuméricos.',
      },
      [DocumentIDType.PPT]: {
        regex: /^PPT\d{9,12}$/,
        error: 'Debe comenzar con "PPT" seguido de entre 9 y 12 números.',
      },
    };

    const validation = validations[type];
    if (!validation) {
      document.error = 'Tipo de documento no reconocido.';
      return document;
    }

    if (!validation.regex.test(trimmed)) {
      document.error = validation.error;
    }

    return document;
  }

  public validateAnswer(payload: QuestionAnswer): Observable<ValidatedAnswer> {
    return this.http.post<ValidatedAnswer>(`${ this.baseUrl }/validate-answer`, payload);
  }

  public generateRightPetitionText(rpRequest: RightPetitionRequest): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(`${ this.baseUrl }/right-petition`, rpRequest);
  }

  public getPdf(): void {
    const filename = this.pdfName();
    if (filename) {
      this.jsPdfService.save(filename);
    }
  }

  private generateRightPetition(): void {
    if (!this.document) return;

    this.document.expedition = this.answers[0];

    const rpRequest: RightPetitionRequest = {
      documentId: this.document,
      fullName: this.answers[1],
      phone: this.answers[2],
      email: this.answers[3],
      city: this.answers[4],
      address: this.answers[5],
      recipient: this.answers[6],
      facts: this.answers[7],
      request: this.answers[8],
    };

    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateRightPetitionPDF(rpRequest);
  }

  private generateRightPetitionPDF(rpRequest: RightPetitionRequest): void {
    this.generateRightPetitionText(rpRequest).subscribe({
      next: (res) => {
        const bodyText = res.choices[0].response.content;
        if (bodyText) {
          this.generatePdfDocument(rpRequest, bodyText);
        } else {
          this.pushAssistantMessage('Error generando el texto del documento.');
        }
      },
      error: () => {
        this.pushAssistantMessage('Error al comunicarse con el servidor.');
      }
    });
  }

  private generatePdfDocument(rp: RightPetitionRequest, bodyText: string): void {
    this.jsPdfService.writeBlock(cityAndDate(rp.city), 'right');
    this.jsPdfService.writeBlock('');
    this.jsPdfService.writeBlock(bodyText);
    this.jsPdfService.writeBlock('Cordialmente,');
    this.jsPdfService.writeBlock('');
    this.jsPdfService.writeBlock('_______________________________');
    this.jsPdfService.writeBlock(titleCase(rp.fullName));
    this.jsPdfService.writeBlock(`${ getDocumentAbbreviation(rp.documentId.type) }. ${ rp.documentId.number }`);
    this.jsPdfService.writeBlock(`Teléfono: ${ rp.phone }`);
    this.jsPdfService.writeBlock(`Correo: ${ rp.email }`);
    this.jsPdfService.writeBlock(`Dirección: ${ rp.address }`);

    this.pdfName.set(`DP_${ rp.documentId.number }.pdf`);
  }

  private pushUserMessage(text: string): void {
    this.messages.update((s) => [ ...s, { id: '', role: 'user', text } ]);
  }

  private pushAssistantMessage(text: string): void {
    this.messages.update((s) => [ ...s, { id: '', role: 'assistant', text } ]);
  }

}

