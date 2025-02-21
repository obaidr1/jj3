export enum ErrorCode {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_EMAIL_EXISTS = 'AUTH_EMAIL_EXISTS',
  AUTH_WEAK_PASSWORD = 'AUTH_WEAK_PASSWORD',
  AUTH_INVALID_EMAIL = 'AUTH_INVALID_EMAIL',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_NOT_AUTHORIZED = 'AUTH_NOT_AUTHORIZED',

  // File Errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE = 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

  // Competition Errors
  COMPETITION_NOT_FOUND = 'COMPETITION_NOT_FOUND',
  COMPETITION_CREATE_FAILED = 'COMPETITION_CREATE_FAILED',
  COMPETITION_UPDATE_FAILED = 'COMPETITION_UPDATE_FAILED',
  COMPETITION_DELETE_FAILED = 'COMPETITION_DELETE_FAILED',
  COMPETITION_FULL = 'COMPETITION_FULL',
  COMPETITION_REGISTRATION_CLOSED = 'COMPETITION_REGISTRATION_CLOSED',

  // Storage Errors
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_WRITE_FAILED = 'STORAGE_WRITE_FAILED',

  // Validation Errors
  VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_DATE = 'VALIDATION_INVALID_DATE',
  VALIDATION_INVALID_AMOUNT = 'VALIDATION_INVALID_AMOUNT',

  // Generic Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  field?: string;
}

export const ErrorMessages: Record<ErrorCode, string> = {
  // Authentication Errors
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.AUTH_EMAIL_EXISTS]: 'An account with this email already exists',
  [ErrorCode.AUTH_WEAK_PASSWORD]: 'Password is too weak. It should be at least 8 characters long and include numbers and special characters',
  [ErrorCode.AUTH_INVALID_EMAIL]: 'Please enter a valid email address',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'User not found',
  [ErrorCode.AUTH_NOT_AUTHORIZED]: 'You are not authorized to perform this action',

  // File Errors
  [ErrorCode.FILE_TOO_LARGE]: 'File is too large. Maximum size is 5MB',
  [ErrorCode.FILE_INVALID_TYPE]: 'Invalid file type. Please upload an image (JPG, PNG, or GIF)',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'Failed to upload file. Please try again',

  // Competition Errors
  [ErrorCode.COMPETITION_NOT_FOUND]: 'Competition not found',
  [ErrorCode.COMPETITION_CREATE_FAILED]: 'Failed to create competition',
  [ErrorCode.COMPETITION_UPDATE_FAILED]: 'Failed to update competition',
  [ErrorCode.COMPETITION_DELETE_FAILED]: 'Failed to delete competition',
  [ErrorCode.COMPETITION_FULL]: 'This competition is full',
  [ErrorCode.COMPETITION_REGISTRATION_CLOSED]: 'Registration for this competition is closed',

  // Storage Errors
  [ErrorCode.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded. Please delete some old data or reduce image size',
  [ErrorCode.STORAGE_WRITE_FAILED]: 'Failed to save data. Please try again',

  // Validation Errors
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: 'This field is required',
  [ErrorCode.VALIDATION_INVALID_DATE]: 'Please enter a valid date',
  [ErrorCode.VALIDATION_INVALID_AMOUNT]: 'Please enter a valid amount',

  // Generic Errors
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection',
  [ErrorCode.SERVER_ERROR]: 'Server error. Please try again later'
}

export function createError(code: ErrorCode, field?: string): AppError {
  return {
    code,
    message: ErrorMessages[code],
    field
  }
}

export function handleError(error: unknown): AppError {
  if ((error as any)?.name === 'QuotaExceededError') {
    return createError(ErrorCode.STORAGE_QUOTA_EXCEEDED)
  }

  if (error instanceof Error) {
    switch (error.message) {
      case 'Failed to fetch':
        return createError(ErrorCode.NETWORK_ERROR)
      default:
        return createError(ErrorCode.UNKNOWN_ERROR)
    }
  }

  return createError(ErrorCode.UNKNOWN_ERROR)
} 