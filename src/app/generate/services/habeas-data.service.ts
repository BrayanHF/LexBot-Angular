import { Injectable } from '@angular/core';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
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

  // public override answers = [
  //   "Bogotá D.C.",
  //   "Sofía Martínez López",
  //   "3159876543",
  //   "sofia.martinez@example.com",
  //   "Barranquilla",
  //   "Carrera 55 #23-12, Barranquilla",
  //   "Banco de la República",
  //   "Carrera 44 #36-15, Bogotá D.C.",
  //   "conocer",
  //   "toda la información crediticia y transaccional asociada a mi número de cédula",
  //   "enero de 2020 a marzo de 2025",
  //   "Copia de mi cédula de ciudadanía; certificado de afiliación a la entidad financiera."
  // ];
  //
  // public override startQuestions(documentId: DocumentId) {
  //   this.documentId = documentId;
  //   this.generatePDF();
  // }

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

    this.isGenerating.set(true);
    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateDocumentService.generateHabeasDataPDF(hdRequest).subscribe({
      next: (pdfBlob) => {
        this.isGenerating.set(false);
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HD_${ hdRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: _ => this.handleGeneratingError()
    });

  }

}
