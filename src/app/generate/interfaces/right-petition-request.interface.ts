import { DocumentId } from './document-id.interface';

export interface RightPetitionRequest {

  documentId: DocumentId;
  fullName: string,
  phone: string,
  email: string,
  city: string,
  address: string,

  recipient: string,
  facts: string,
  request: string,

}
