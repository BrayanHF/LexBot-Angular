export interface RightPetitionResponse {
  header: {
    cityAndDate: string;
    fullName: string;
    documentId: string;
    phone: string;
    email: string;
    address: string;
  };
  recipient: string;
  subject: string;
  greeting: string;
  body: {
    facts: string;
    request: string;
    legalBasis: string;
  };
  closing: string;
  signature: {
    fullName: string;
    documentId: string;
  };
}
