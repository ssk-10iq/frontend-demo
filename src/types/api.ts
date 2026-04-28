export interface ApiResponse<T> {
  data: T;
  pagination?: {
    next_cursor?: string;
    prev_cursor?: string;
    has_more: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
