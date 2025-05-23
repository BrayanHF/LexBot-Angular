import { Injectable } from '@angular/core';
import { DocumentGeneratorType } from '../../shared/types/document-generators';
import { DocumentGeneratorBase } from '../helpers/document-generator-base';
import { ComplaintRequest } from '../interfaces/complaint-request.interface';

@Injectable({ providedIn: 'root' })
export class ComplaintService extends DocumentGeneratorBase {

  public override documentType: DocumentGeneratorType = "complaint";

  public override questions = [
    "¿Cuál es el lugar de expedición de tu documento?",
    "¿Cuál es tu nombre completo?",
    "¿Cuál es tu número de teléfono de contacto?",
    "¿Cuál es tu correo electrónico para que te notifiquen?",
    "¿En qué ciudad estás presentando esta querella?",
    "¿Cuál es la dirección de tu casa o dónde quieres que te respondan?",

    "¿A qué autoridad vas a enviar tu querella?",
    "¿Cuál es el motivo o referencia de tu querella?",
    "¿Cómo se llama la persona contra la que vas a presentar la querella?",
    "¿Cuál es el documento de identidad o cómo describirías a esa persona si no conoces su cédula?",
    "¿Conoces la dirección o datos de contacto de esa persona? Indícalos si los tienes.",
    "¿En qué consiste el conflicto o la conducta que reclamas? (explica con tus palabras)",
    "¿Qué pruebas tienes para demostrar lo sucedido?",
    "¿Intentaste hablar o notificar a la otra persona antes de esto? ¿Qué pasó?",
    "¿Qué quieres que haga la autoridad? (por ejemplo, ordenar cese de la conducta, reparar daños…)",
    "¿Qué documentos tienes para probar tu caso? (contratos, escrituras, fotos…)",
    "¿Tienes otras pruebas? (videos, mensajes, testigos…)",
    "¿Quieres que la autoridad ordene alguna diligencia especial? (inspección ocular, llamado a testigos…)",
    "¿Dónde recibirás las notificaciones del proceso?",
    "¿Tienes datos de notificación de la otra persona?",
    "¿Vas a anexar documentos además de este generado? Si sí, ¿cuáles?"
  ];

  public override generatePDF(): void {
    if (!this.documentId) return;

    this.documentId.expedition = this.answers[0];

    const cRequest: ComplaintRequest = {
      documentId: this.documentId,
      fullName: this.answers[1],
      phone: this.answers[2],
      email: this.answers[3],
      city: this.answers[4],
      address: this.answers[5],
      authority: this.answers[6],
      reference: this.answers[7],
      defendantName: this.answers[8],
      defendantIdOrDesc: this.answers[9],
      defendantContact: this.answers[10],
      conflictDescription: this.answers[11],
      mainEvidence: this.answers[12],
      priorNotification: this.answers[13],
      desiredOutcome: this.answers[14],
      documents: this.answers[15],
      otherEvidence: this.answers[16],
      specialDiligence: this.answers[17],
      notificationAddress: this.answers[18],
      defendantNotification: this.answers[19],
      additionalAttachments: this.answers[20],
    };

    this.pushAssistantMessage('Generando documento, por favor espera...');
    this.generateDocumentService.generateComplaintPDF(cRequest).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([ pdfBlob ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Querella_${ cRequest.documentId.number }.pdf`;
        this.pdfLink.set(a);
      },
      error: () => {
        this.pushAssistantMessage('Error al comunicarse con el servidor.');
      }
    });
  }

}
