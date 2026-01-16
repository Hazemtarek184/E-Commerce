import { Request, Response } from "express";
import * as categoriesService from "./categoriesService";
import { sendErrorResponse , sendSuccessResponse} from "../utils/response";

// GET OPERATIONS
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await categoriesService.getAllCategories();
        sendSuccessResponse(res, 200, { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

// CREATE OPERATIONS
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            sendErrorResponse(res, 400, "Request body is required");
            return;
        }

        const { englishName, arabicName } = req.body;

        if (!englishName || !arabicName) {
            sendErrorResponse(res, 400, "English and Arabic names are required");
            return;
        }

        const newCategory = await categoriesService.createCategory(englishName, arabicName);
        sendSuccessResponse(res, 201, { category: newCategory }, "Category created successfully");
    } catch (error: any) {
        console.error("Error creating category:", error);
        sendErrorResponse(res, 500, error.message || "Internal server error");
    }
};

// UPDATE OPERATIONS
export const updateMainCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const { englishName, arabicName } = req.body;

        if (!categoryId) {
            sendErrorResponse(res, 400, "Category ID is required");
            return;
        }

        if (!englishName && !arabicName) {
            sendErrorResponse(res, 400, "At least one field (English or Arabic name) is required");
            return;
        }

        const updateData: any = {};
        if (englishName) updateData.englishName = englishName;
        if (arabicName) updateData.arabicName = arabicName;

        const updatedCategory = await categoriesService.updateCategory(categoryId, updateData);
        sendSuccessResponse(res, 200, { category: updatedCategory }, "Category updated successfully");
    } catch (error: any) {
        console.error("Error updating category:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

// DELETE OPERATIONS
export const deleteMainCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            sendErrorResponse(res, 400, "Category ID is required");
            return;
        }

        await categoriesService.deleteCategory(categoryId);
        sendSuccessResponse(res, 200, null, "Category and all associated data deleted successfully");
    } catch (error: any) {
        console.error("Error deleting category:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};