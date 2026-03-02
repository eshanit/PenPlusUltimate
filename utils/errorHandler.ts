/**
 * Centralized error handling utilities
 */

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle and log errors with context
 */
export const handleError = (error: unknown, context: string): AppError => {
  if (error instanceof AppError) {
    console.error(`[${context}] ${error.code}:`, error.message);
    if (error.details) {
      console.error(`[${context}] Details:`, error.details);
    }
    return error;
  }

  if (error instanceof Error) {
    console.error(`[${context}] Unexpected error:`, error.message);
    console.error(`[${context}] Stack:`, error.stack);
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  console.error(`[${context}] Unknown error type:`, typeof error);
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500);
};

/**
 * Wrap async functions with error handling
 */
export const withErrorHandling = async <T>(
  context: string,
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    throw handleError(error, context);
  }
};

/**
 * Create a typed error factory
 */
export const createErrorFactory = (defaultCode: string, defaultStatus: number = 500) => {
  return (message: string, code?: string, status?: number, details?: Record<string, unknown>): AppError => {
    return new AppError(
      message,
      code || defaultCode,
      status || defaultStatus,
      details
    );
  };
};

/**
 * Predefined error factories
 */
export const errors = {
  notFound: createErrorFactory('NOT_FOUND', 404),
  validation: createErrorFactory('VALIDATION_ERROR', 400),
  unauthorized: createErrorFactory('UNAUTHORIZED', 401),
  forbidden: createErrorFactory('FORBIDDEN', 403),
  conflict: createErrorFactory('CONFLICT', 409),
  serverError: createErrorFactory('SERVER_ERROR', 500),
  networkError: createErrorFactory('NETWORK_ERROR', 503),
};

/**
 * Type guard for AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Extract error message from unknown error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Extract error code from unknown error
 */
export const getErrorCode = (error: unknown): string => {
  if (isAppError(error)) {
    return error.code;
  }
  return 'UNKNOWN_ERROR';
};
