import { Request, Response } from "express";
import * as categoriesService from "./categoriesService";

// Utility functions for consistent responses
const sendErrorResponse = (res: Response, statusCode: number, message: string): void => {
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

const sendSuccessResponse = <T>(res: Response, statusCode: number, data?: T, message?: string): void => {
    const response: any = {
        success: true,
        ...(data && { data }),
        ...(message && { message })
    };
    res.status(statusCode).json(response);
};

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

export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mainCategoryId } = req.params;

        if (!mainCategoryId) {
            sendErrorResponse(res, 400, "Main category ID is required");
            return;
        }

        const subCategories = await categoriesService.getSubCategories(mainCategoryId);
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

export const getServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        const serviceProviders = await categoriesService.getServiceProviders(subCategoryId);

        if (!serviceProviders || serviceProviders.length === 0) {
            sendSuccessResponse(res, 200, { serviceProviders: [] }, "No service providers found for this sub-category");
            return;
        }

        sendSuccessResponse(res, 200, { serviceProviders });
    } catch (error: any) {
        console.error("Error fetching service providers:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

export const searchServiceProvidersByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchString } = req.query;
        if (!searchString || typeof searchString !== 'string') {
            sendErrorResponse(res, 400, "Query string is required");
            return;
        }

        const providers = await categoriesService.searchServiceProviders(searchString);
        sendSuccessResponse(res, 200, { providers });
    } catch (error: any) {
        console.error("Error searching service providers:", error);
        sendErrorResponse(res, 500, error.message || "Internal server error");
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

        const newSubCategory = await categoriesService.createSubCategory(mainCategoryId, englishName, arabicName);

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

export const createServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            sendErrorResponse(res, 400, "Request body is required");
            return;
        }

        const { name, bio, workingDays, workingHours, closingHours, phoneContacts, locationLinks, offers } = req.body;
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!name || !bio || !workingDays || !workingHours || !closingHours || !phoneContacts || !locationLinks) {
            sendErrorResponse(res, 400, "All required fields must be provided");
            return;
        }

        let imagesUrl: { url: string; public_id: string }[] = [];

        // Handle File Upload
        if (req.file) {
            const result = await categoriesService.uploadToCloudinary(req.file.buffer, 'E-Commerce');
            imagesUrl.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        // Also allow passing imagesUrl directly if no file is uploaded (optional, for backward compatibility or direct URL passing) or merge them
        // if (req.body.imagesUrl) {
        //     let bodyImages = req.body.imagesUrl;
        //     if (typeof bodyImages === 'string') {
        //         try {
        //             bodyImages = JSON.parse(bodyImages);
        //         } catch (e) {
        //             // ignore or handle error
        //         }
        //     }
        //     if (Array.isArray(bodyImages)) {
        //         imagesUrl = [...imagesUrl, ...bodyImages];
        //     } else if (typeof bodyImages === 'object' && bodyImages.url && bodyImages.public_id) {
        //         imagesUrl.push(bodyImages);
        //     }
        // }


        const serviceProviderData = {
            name,
            bio,
            imagesUrl,
            workingDays,
            workingHours,
            closingHours,
            phoneContacts,
            locationLinks,
            offers
        };

        const newServiceProvider = await categoriesService.createServiceProvider(subCategoryId, serviceProviderData);
        sendSuccessResponse(res, 201, { serviceProvider: newServiceProvider }, "Service provider created successfully");
    } catch (error: any) {
        console.error("Error creating service provider:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
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

        const updatedSubCategory = await categoriesService.updateSubCategory(subCategoryId, updateData);
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

export const updateServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceProviderId } = req.params;
        const { name, bio, workingDays, workingHours, closingHours, phoneContacts, locationLinks, offers } = req.body;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider ID is required");
            return;
        }

        const updateData: any = {};
        if (name !== undefined && name) updateData.name = name;
        if (bio !== undefined && bio) updateData.bio = bio;
        if (workingDays !== undefined && workingDays.size != 0) updateData.workingDays = workingDays;
        if (workingHours !== undefined && workingHours.size != 0) updateData.workingHours = workingHours;
        if (closingHours !== undefined && closingHours.size != 0) updateData.closingHours = closingHours;
        if (phoneContacts !== undefined && phoneContacts.size != 0) updateData.phoneContacts = phoneContacts;
        if (locationLinks !== undefined && locationLinks.size != 0) updateData.locationLinks = locationLinks;
        if (offers !== undefined) updateData.offers = offers;

        if (Object.keys(updateData).length === 0) {
            sendErrorResponse(res, 400, "At least one field is required for update");
            return;
        }

        const updatedServiceProvider = await categoriesService.updateServiceProvider(serviceProviderId, updateData);
        sendSuccessResponse(res, 200, { serviceProvider: updatedServiceProvider }, "Service provider updated successfully");
    } catch (error: any) {
        console.error("Error updating service provider:", error);
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

export const deleteSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        await categoriesService.deleteSubCategory(subCategoryId);
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

export const deleteServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceProviderId } = req.params;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider ID is required");
            return;
        }

        await categoriesService.deleteServiceProvider(serviceProviderId);
        sendSuccessResponse(res, 200, null, "Service provider deleted successfully");
    } catch (error: any) {
        console.error("Error deleting service provider:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};

export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        if (!file) {
            sendErrorResponse(res, 400, "No photo uploaded");
            return;
        }

        const result = await categoriesService.uploadToCloudinary(file.buffer, 'E-Commerce');

        const imageData = {
            url: result.secure_url,
            public_id: result.public_id
        };

        sendSuccessResponse(res, 201, imageData, "Photo stored successfully");
    } catch (error: any) {
        console.error("Error uploading failed:", error);
        sendErrorResponse(res, 500, error.message || "Internal server error");
    }
};

export const uploadPhotos = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            sendErrorResponse(res, 400, "No photos uploaded");
            return;
        }

        const files = req.files as Express.Multer.File[];
        const { serviceProviderId } = req.body;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider id is missing");
            return;
        }

        const imageData = await categoriesService.addPhotosToServiceProvider(serviceProviderId, files);
        sendSuccessResponse(res, 201, imageData, "Photos stored successfully");
    } catch (error: any) {
        console.error("Error uploading failed:", error);
        if (error.message.includes("not found")) {
            sendErrorResponse(res, 404, error.message);
        } else if (error.message.includes("Invalid")) {
            sendErrorResponse(res, 400, error.message);
        } else {
            sendErrorResponse(res, 500, "Internal server error");
        }
    }
};
