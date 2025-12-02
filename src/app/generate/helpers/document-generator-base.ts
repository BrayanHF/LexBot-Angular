import { inject, signal } from '@angular/core';
import { Message } from '../../conversation/interfaces/message.interface';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentGenerator } from '../interfaces/document-generator,interface';
import { DocumentId } from '../interfaces/document-id.interface';
import { GenerateDocumentService } from '../services/generate-document.service';

export abstract class DocumentGeneratorBase implements DocumentGenerator {

  protected generateDocumentService = inject(GenerateDocumentService);

  public pdfLink = signal<HTMLAnchorElement | null>(null);
  public messages = signal<Message[]>([]);
  public isGenerating = signal(false);
  public documentId: DocumentId | null = null;
  public agentDocumentId: DocumentId | null = null;
  public currentQuestionIndex = 0;
  public answers: string[] = [];

  abstract documentType: DocumentGeneratorType;
  abstract questions: string[];

  public startQuestions(documentId: DocumentId): void {
    this.documentId = documentId;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.messages.set([]);
    this.pushAssistantMessage(this.questions[0]);
  }

  public handleUserAnswers(userAnswer: string): void {
    if (!this.documentId || this.currentQuestionIndex >= this.questions.length) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.pushUserMessage(userAnswer);

    this.generateDocumentService.validateAnswer({
      question: currentQuestion,
      answer: userAnswer
    }, this.documentType).subscribe({
      next: (validation) => {
        if (validation.error || (validation.error == null && validation.result == null)) {
          this.pushAssistantMessage(validation.error ?? "Hubo un error al validar tu respuesta. Intenta de nuevo más tarde.");
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

  public getPdf(): void {
    const link = this.pdfLink();
    if (link) {
      link.click();
    }
  }

  public cleanAll(): void {
    const link = this.pdfLink();
    if (link) {
      URL.revokeObjectURL(link.href);
      this.pdfLink.set(null);
    }
    this.messages.set([]);
    this.documentId = null;
    this.currentQuestionIndex = 0;
    this.answers = [];
  }

  public handleGeneratingError() {
    this.isGenerating.set(false);
    this.pushAssistantMessage('Parece que hubo un error en el servidor.');
  }

  protected pushUserMessage(text: string): void {
    this.messages.update((s) => [ ...s, { id: '', role: 'user', text } ]);
  }

  protected pushAssistantMessage(text: string): void {
    this.messages.update((s) => [ ...s, { id: '', role: 'assistant', text } ]);
  }

  abstract generatePDF(): void;

}
