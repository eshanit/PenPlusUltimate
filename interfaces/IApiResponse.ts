/**
 * Standardized API response types
 */

/**
 * Generic API response wrapper
 */
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
  timestamp?: number;
}

/**
 * API error details
 */
export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

/**
 * Paginated response
 */
export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * CRUD operation results
 */
export interface ICreateResult<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
}

export interface IUpdateResult<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
}

export interface IDeleteResult {
  success: boolean;
  deletedId: string;
  error?: IApiError;
}

export interface IGetResult<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
}
