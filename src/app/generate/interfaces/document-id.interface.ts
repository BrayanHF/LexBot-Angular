import { DocumentIDType } from '../../conversation/enum/document-id-type.enum';

export interface DocumentId {
  type: DocumentIDType;
  number: string;
  expedition: string;
  error: string | null;
}
