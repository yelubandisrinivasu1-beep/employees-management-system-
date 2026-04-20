import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  timestamp?: string;
  requestId?: string;
}

export class ResponseHandler {
  /**
   * Send success response
   */
  static success<T = any>(
    res: Response,
    data?: T,
    message: string = "Success",
    statusCode: number = 200,
    count?: number
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (count !== undefined) {
      response.count = count;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string = "Internal server error",
    statusCode: number = 500,
    errorCode?: string,
    data?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errorCode) {
      response.data = { errorCode, ...data };
    } else if (data) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    errors: string | string[] | Record<string, string>
  ): Response {
    let errorData: any = {};

    if (Array.isArray(errors)) {
      errorData = { errors };
    } else if (typeof errors === "string") {
      errorData = { error: errors };
    } else {
      errorData = errors;
    }

    return this.error(
      res,
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      errorData
    );
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, resource: string = "Resource"): Response {
    return this.error(res, `${resource} not found`, 404, "NOT_FOUND");
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = "Unauthorized"): Response {
    return this.error(res, message, 401, "UNAUTHORIZED");
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, 403, "FORBIDDEN");
  }

  /**
   * Send bad request response
   */
  static badRequest(res: Response, message: string = "Bad request"): Response {
    return this.error(res, message, 400, "BAD_REQUEST");
  }

  /**
   * Send conflict response (duplicate resource)
   */
  static conflict(res: Response, message: string = "Resource already exists"): Response {
    return this.error(res, message, 409, "CONFLICT");
  }
}
