import { Signal, } from '@angular/core';
import { Message } from "../../conversation/interfaces/message.interface";
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentId } from './document-id.interface';

export interface DocumentGenerator {

  messages: Signal<Message[]>;
  pdfLink: Signal<HTMLAnchorElement | null>;
  documentId: DocumentId | null;
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;

  documentType: DocumentGeneratorType;

  startQuestions(documentId: DocumentId): void;

  handleUserAnswers(userAnswer: string): void;

  generatePDF(): void;

  getPdf(): void;

  cleanAll(): void;

}
