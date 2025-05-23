import { DocumentId } from './document-id.interface';

export interface SpecialPowerRequest {
  documentId: DocumentId;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;


  agentDocumentId: DocumentId;
  agentFullName: string;
  agentPhone: string;
  agentEmail: string;
  agentAddress: string;

  grantedPowers: string;
  duration: string;
  attachedDocuments: string;
}
