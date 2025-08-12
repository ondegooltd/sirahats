import { NextResponse } from "next/server";
import { logger } from "./logger"; 

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(
  data: T,
  message: string = "Operation successful",
  metadata?: Record<string, any>
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    metadata,
  };

  logger.info(message, { metadata });
  return NextResponse.json(response);
}

export function errorResponse(
  error: Error | string,
  statusCode: number = 500,
  metadata?: Record<string, any>
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error;
  const response: ApiResponse = {
    success: false,
    message,
    error: error instanceof Error ? error.stack : undefined,
    metadata,
  };

  logger.error(message, { error, metadata });
  return NextResponse.json(response, { status: statusCode });
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return errorResponse(error, error.statusCode, error.metadata);
  }

  if (error instanceof Error) {
    return errorResponse(error);
  }

  return errorResponse("An unexpected error occurred");
} 