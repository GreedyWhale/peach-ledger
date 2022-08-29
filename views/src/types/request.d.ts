export interface Response<T> {
  message: string;
  data: T;
  code: number;
  errors?: Record<string, string[]> | null;
}
