export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}
