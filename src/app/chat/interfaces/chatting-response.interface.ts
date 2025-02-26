import { AIChatResponse } from './ai-chat-response.interface';

export interface ChattingResponse {
  newChatId: string | null;
  aiChatResponse: AIChatResponse
}
