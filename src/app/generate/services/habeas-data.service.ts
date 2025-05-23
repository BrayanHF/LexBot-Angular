import { Injectable } from '@angular/core';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentId } from '../interfaces/document-id.interface';
import { HabeasDataRequest } from '../interfaces/habeas-data-request.interface';

@Injectable({
  providedIn: 'root'
})
export class HabeasDataService extends DocumentGeneratorBase {
  public override documentType: DocumentGeneratorType = "habeas-data";
  public override questions = [
    "¿Cuál es el lugar de expedición de tu documento de identidad?",
    "¿Cuál es tu nombre completo?",
    "¿Cuál es tu número de teléfono de contacto?",
    "¿Cuál es tu correo electrónico para que te notifiquen?",
    "¿En qué ciudad estás presentando esta solicitud?",
    "¿Cuál es la dirección de tu casa o dónde quieres que te respondan?",

    "¿Cuál es el nombre de la entidad o empresa ante la que ejerces tu derecho de hábeas data?",
    "¿Dónde está ubicada esa entidad? (dirección y ciudad)",
    "¿Qué acción deseas realizar con tus datos personales? (conocer, actualizar, rectificar, suprimir, revocar autorización u otro)",
    "¿Qué datos o información específica deseas consultar o modificar? (descripción detallada)",
    "¿En qué fecha o periodo se realizó el tratamiento de esos datos?",
    "¿Vas a anexar documentación que respalde tu solicitud? Si sí, ¿cuáles?"
  ];

  public override generatePDF(): void {
    if (!this.documentId) return;

    const hdRequest: HabeasDataRequest = {
      documentId: this.documentId,
      fullName: this.answers[1],
      phone: this.answers[2],
      email: this.answers[3],
      city: this.answers[4],
      address: this.answers[5],
      entityName: this.answers[6],
      entityLocation: this.answers[7],
      requestedAction: this.answers[8],
      dataDescription: this.answers[9],
      treatmentDatePeriod: this.answers[10],
      supportingDocuments: this.answers[11],
    }


    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateDocumentService.generateHabeasDataPDF(hdRequest).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HD_${ hdRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: () => {
        this.pushAssistantMessage('Error al comunicarse con el servidor.');
      }
    });

  }

}
