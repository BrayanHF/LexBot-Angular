import { DocumentIDType } from '../../conversation/enum/document-id-type.enum';

export function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export const validateDocument: Record<DocumentIDType, { regex: RegExp; error: string }> = {
  [DocumentIDType.CedulaCiudadania]: {
    regex: /^\d{7,10}$/,
    error: 'Debe contener solo números entre 7 y 10 dígitos.',
  },
  [DocumentIDType.TarjetaIdentidad]: {
    regex: /^\d{7,10}$/,
    error: 'Debe contener solo números entre 7 y 10 dígitos.',
  },
  [DocumentIDType.CedulaExtranjeria]: {
    regex: /^[A-Za-z0-9]{7,12}$/,
    error: 'Debe contener entre 7 y 12 caracteres alfanuméricos.',
  },
  [DocumentIDType.Pasaporte]: {
    regex: /^[A-Za-z0-9]{6,9}$/,
    error: 'Debe contener entre 6 y 9 caracteres alfanuméricos.',
  },
  [DocumentIDType.PPT]: {
    regex: /^PPT\d{9,12}$/,
    error: 'Debe comenzar con "PPT" seguido de entre 9 y 12 números.',
  },
};
