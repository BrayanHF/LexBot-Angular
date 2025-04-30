export interface Choice {
  response: {
    role: string | null;
    content: string | null;
  };
  finish_reason: string | null;
}
