import { Injectable } from '@angular/core';
import { DocumentIDType } from '../../conversation/enum/document-id-type.enum';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';
import { DocumentId } from '../interfaces/document-id.interface';
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

  // public override answers = [
  //   "Cali, Valle del Cauca",
  //   "Ana María Torres Gómez",
  //   "3001234567",
  //   "ana.torres@example.com",
  //   "Cali",
  //   "Calle 23 #45-67, Cali",
  //   "Luis Fernando Martínez Rodríguez",
  //   "3107654321",
  //   "luis.martinez@example.com",
  //   "Carrera 10 #22-58, Cali",
  //   "Facultar al apoderado para representarme ante entidades bancarias, suscribir documentos relacionados con el préstamo hipotecario de mi vivienda y gestionar desembolsos.",
  //   "Seis meses contados a partir de la firma del presente poder.",
  //   "Copia de mi cédula de ciudadanía; copia de la matrícula inmobiliaria de mi vivienda."
  // ];
  //
  //
  // public override startQuestions(documentId: DocumentId) {
  //   this.documentId = documentId;
  //   this.agentDocumentId = {
  //     type: DocumentIDType.CedulaCiudadania,
  //     number: "2323232332",
  //     expedition: '',
  //     error: null
  //   }
  //   this.generatePDF();
  // }

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

    this.isGenerating.set(true);
    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateDocumentService.generateSpecialPowerPDF(spRequest).subscribe({
      next: (pdfBlob) => {
        this.isGenerating.set(false);
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Poder_${ spRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: e => this.handleGeneratingError()
    });

  }

}
