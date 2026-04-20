"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    /**
     * Send success response
     */
    static success(res, data, message = "Success", statusCode = 200, count) {
        const response = {
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
    static error(res, message = "Internal server error", statusCode = 500, errorCode, data) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
        };
        if (errorCode) {
            response.data = Object.assign({ errorCode }, data);
        }
        else if (data) {
            response.data = data;
        }
        return res.status(statusCode).json(response);
    }
    /**
     * Send validation error response
     */
    static validationError(res, errors) {
        let errorData = {};
        if (Array.isArray(errors)) {
            errorData = { errors };
        }
        else if (typeof errors === "string") {
            errorData = { error: errors };
        }
        else {
            errorData = errors;
        }
        return this.error(res, "Validation failed", 400, "VALIDATION_ERROR", errorData);
    }
    /**
     * Send not found response
     */
    static notFound(res, resource = "Resource") {
        return this.error(res, `${resource} not found`, 404, "NOT_FOUND");
    }
    /**
     * Send unauthorized response
     */
    static unauthorized(res, message = "Unauthorized") {
        return this.error(res, message, 401, "UNAUTHORIZED");
    }
    /**
     * Send forbidden response
     */
    static forbidden(res, message = "Forbidden") {
        return this.error(res, message, 403, "FORBIDDEN");
    }
    /**
     * Send bad request response
     */
    static badRequest(res, message = "Bad request") {
        return this.error(res, message, 400, "BAD_REQUEST");
    }
    /**
     * Send conflict response (duplicate resource)
     */
    static conflict(res, message = "Resource already exists") {
        return this.error(res, message, 409, "CONFLICT");
    }
}
exports.ResponseHandler = ResponseHandler;
