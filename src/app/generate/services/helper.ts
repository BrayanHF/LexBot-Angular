import { DocumentIDType } from '../../conversation/enum/document-id-type.enum';
import { RightPetitionRequest } from '../interfaces/right-petition-request.interface';

export function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function cityAndDate(city: string): string {
  return `${ city }, ${ new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) }`;
}

const documentAbbreviations: Record<DocumentIDType, string> = {
  [DocumentIDType.CedulaCiudadania]: "CC",
  [DocumentIDType.TarjetaIdentidad]: "TI",
  [DocumentIDType.CedulaExtranjeria]: "CE",
  [DocumentIDType.Pasaporte]: "PA",
  [DocumentIDType.PPT]: "PPT"
};

export function getDocumentAbbreviation(type: DocumentIDType): string {
  return documentAbbreviations[type] ?? "N/A";
}
