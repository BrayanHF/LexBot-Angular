export interface LBApiResponse<T> {
  success: boolean;
  stream: boolean;
  data: T;
  error: string | null;
}
