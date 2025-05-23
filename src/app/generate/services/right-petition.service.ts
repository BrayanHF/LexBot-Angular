import { Injectable } from '@angular/core';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { RightPetitionRequest } from '../interfaces/right-petition-request.interface';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';

@Injectable({ providedIn: 'root' })
export class RightPetitionService extends DocumentGeneratorBase {

  public override documentType: DocumentGeneratorType = "right-petition";

  public override questions = [
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

  public override handleUserAnswers(userAnswer: string): void {
    if (!this.documentId || this.currentQuestionIndex >= this.questions.length) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.pushUserMessage(userAnswer);

    if (this.currentQuestionIndex === 8) {
      userAnswer = "Hechos: " + this.answers[7] + "\nPeticiones: " + userAnswer;
    }

    this.generateDocumentService.validateAnswer({
      question: currentQuestion,
      answer: userAnswer
    }, "right-petition").subscribe({
      next: (validation) => {
        if (validation.error) {
          this.pushAssistantMessage(validation.error);
          return;
        }

        this.answers.push(validation.result ?? userAnswer);
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
          this.pushAssistantMessage(this.questions[this.currentQuestionIndex]);
        } else {
          this.generatePDF();
        }
      },
      error: () => {
        this.pushAssistantMessage('Hubo un error al validar tu respuesta. Intenta de nuevo más tarde.');
      }
    });
  }

  public override generatePDF(): void {
    if (!this.documentId) return;

    this.documentId.expedition = this.answers[0];

    const rpRequest: RightPetitionRequest = {
      documentId: this.documentId,
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
    this.generateDocumentService.generateRightPetitionPDF(rpRequest).subscribe({
      next: (pdfBlob) => {
        console.log(pdfBlob);
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DP_${ rpRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: () => {
        this.pushAssistantMessage('Error al comunicarse con el servidor.');
      }
    });
  }

}
