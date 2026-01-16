import { Response } from "express";

// Utility functions for consistent responses
export const sendErrorResponse = (res: Response, statusCode: number, message: string): void => {
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

export const sendSuccessResponse = <T>(res: Response, statusCode: number, data?: T, message?: string): void => {
    const response: any = {
        success: true,
        ...(data && { data }),
        ...(message && { message })
    };
    res.status(statusCode).json(response);
};