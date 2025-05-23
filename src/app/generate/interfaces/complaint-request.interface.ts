import { DocumentId } from './document-id.interface';

export interface ComplaintRequest {
  documentId: DocumentId;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;

  authority: string;
  reference: string;

  defendantName: string;
  defendantIdOrDesc: string;
  defendantContact: string;

  conflictDescription: string;
  mainEvidence: string;
  priorNotification: string;
  desiredOutcome: string;

  documents: string;
  otherEvidence: string;
  specialDiligence: string;

  notificationAddress: string;
  defendantNotification: string;

  additionalAttachments: string
}
