/**
 * Error types for the application
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  API_FETCH_ERROR = 'API_FETCH_ERROR',
  JSON_PARSE_ERROR = 'JSON_PARSE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * API Error interface
 */
export interface APIError {
  type: ErrorType;
  message: string;
  field?: string;
  details?: any;
}

/**
 * Custom error class
 */
export class AppError extends Error {
  type: ErrorType;
  field?: string;
  details?: any;

  constructor(type: ErrorType, message: string, field?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.field = field;
    this.details = details;
  }
}

/**
 * Format error message for Vietnamese UI
 */
export function formatErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (typeof error === 'object' && error.type) {
    switch (error.type) {
      case ErrorType.VALIDATION_ERROR:
        return `Lỗi xác thực: ${error.message}`;
      case ErrorType.DUPLICATE_ERROR:
        return `Dữ liệu đã tồn tại: ${error.message}`;
      case ErrorType.NOT_FOUND_ERROR:
        return `Không tìm thấy: ${error.message}`;
      case ErrorType.UNAUTHORIZED_ERROR:
        return `Không có quyền truy cập: ${error.message}`;
      case ErrorType.API_FETCH_ERROR:
        return `Lỗi kết nối API: ${error.message}`;
      case ErrorType.JSON_PARSE_ERROR:
        return `Lỗi định dạng JSON: ${error.message}`;
      case ErrorType.DATABASE_ERROR:
        return `Lỗi cơ sở dữ liệu: ${error.message}`;
      default:
        return error.message || 'Có lỗi xảy ra';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Có lỗi xảy ra';
}

/**
 * Get error type from error object
 */
export function getErrorType(error: any): ErrorType {
  if (error instanceof AppError) {
    return error.type;
  }

  if (typeof error === 'object' && error.type) {
    return error.type;
  }

  return ErrorType.DATABASE_ERROR;
}
