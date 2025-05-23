import { Injectable } from '@angular/core';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';
import { SpecialPowerRequest } from '../interfaces/special-power-request.interface';

@Injectable({
  providedIn: 'root'
})
export class PowerOfAttorneyService extends DocumentGeneratorBase {

  public override documentType: DocumentGeneratorType = "power-of-attorney";

  public override questions = [
    "¿Cuál es el lugar de expedición de tu documento?",
    "¿Cuál es tu nombre completo?",
    "¿Cuál es tu número de teléfono de contacto?",
    "¿Cuál es tu correo electrónico para que te notifiquen?",
    "¿En qué ciudad estás presentando este poder?",
    "¿Cuál es la dirección de tu casa o dónde quieres que te respondan?",

    "¿Cómo se llama la persona que recibirá el poder? (nombre completo)",
    "¿Cuál es el número de teléfono de esa persona?",
    "¿Cuál es el correo de esa persona?",
    "¿Dónde vive esa persona? Dime su dirección y ciudad.",

    "¿Qué poderes o facultades específicas le quieres dar? (descríbelas detalladamente)",
    "¿Por cuánto tiempo quieres que dure el poder?",
    "¿Vas a anexar otros documentos? ¿Cuáles?"
  ]

  override generatePDF(): void {
    if (!this.documentId || !this.agentDocumentId) return;

    const spRequest: SpecialPowerRequest = {
      documentId: this.documentId,
      fullName: this.answers[1],
      phone: this.answers[2],
      email: this.answers[3],
      city: this.answers[4],
      address: this.answers[5],


      agentDocumentId: this.agentDocumentId,
      agentFullName: this.answers[6],
      agentPhone: this.answers[7],
      agentEmail: this.answers[8],
      agentAddress: this.answers[9],

      grantedPowers: this.answers[10],
      duration: this.answers[11],
      attachedDocuments: this.answers[12],
    }

    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateDocumentService.generateSpecialPowerPDF(spRequest).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Poder_${ spRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: () => {
        this.pushAssistantMessage('Error al comunicarse con el servidor.');
      }
    });

  }

}
