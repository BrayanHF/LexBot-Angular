export type DocumentGeneratorType =
  | 'right-petition'
  | 'complaint'
  | 'power-of-attorney'
  | 'habeas-data';

export const DOCUMENT_GENERATORS: Record<DocumentGeneratorType, {
  label: string;
  path: string;
}> = {
  'right-petition': {
    label: 'Derecho de petición',
    path: '/chat/generate/right-petition'
  },
  'complaint': {
    label: 'Querella',
    path: '/chat/generate/complaint'
  },
  'power-of-attorney': {
    label: 'Poder especial',
    path: '/chat/generate/power-of-attorney'
  },
  'habeas-data': {
    label: 'Habeas Data',
    path: '/chat/generate/habeas-data'
  }
};
