import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { Request, Response } from "express";
import * as subCategoryService from "./subCategoryService";

export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mainCategoryId } = req.params;

        if (!mainCategoryId) {
            sendErrorResponse(res, 400, "Main category ID is required");
            return;
        }

        const subCategories = await subCategoryService.getSubCategories(mainCategoryId);
        sendSuccessResponse(res, 200, { subCategories });
    } catch (error: any) {
        console.error("Error fetching sub-categories:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

export const createSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { englishName, arabicName } = req.body;
        const { mainCategoryId } = req.params;

        if (!mainCategoryId) {
            sendErrorResponse(res, 400, "Main category ID is required");
            return;
        }

        if (!englishName || !arabicName) {
            sendErrorResponse(res, 400, "English name and Arabic name are required");
            return;
        }

        const newSubCategory = await subCategoryService.createSubCategory(mainCategoryId, englishName, arabicName);

        sendSuccessResponse(res, 201, { subCategory: newSubCategory }, "Sub category created successfully");
    } catch (error: any) {
        console.error("Error creating sub category:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

export const updateSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;
        const { englishName, arabicName } = req.body;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!englishName && !arabicName) {
            sendErrorResponse(res, 400, "At least one field (English or Arabic name) is required");
            return;
        }

        const updateData: any = {};
        if (englishName) updateData.englishName = englishName;
        if (arabicName) updateData.arabicName = arabicName;

        const updatedSubCategory = await subCategoryService.updateSubCategory(subCategoryId, updateData);
        sendSuccessResponse(res, 200, { subCategory: updatedSubCategory }, "Sub-category updated successfully");
    } catch (error: any) {
        console.error("Error updating sub-category:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

export const deleteSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        await subCategoryService.deleteSubCategory(subCategoryId);
        sendSuccessResponse(res, 200, null, "Sub-category and all associated data deleted successfully");
    } catch (error: any) {
        console.error("Error deleting sub-category:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};