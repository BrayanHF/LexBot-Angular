import { DocumentId } from './document-id.interface';

export interface HabeasDataRequest {
  documentId: DocumentId;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;

  entityName: string;
  entityLocation: string;
  requestedAction: string;
  dataDescription: string;
  treatmentDatePeriod: string;
  supportingDocuments: string;
}

