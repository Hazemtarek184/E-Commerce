import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import * as serviceProviderService from "./serviceProviderService";

export const getServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        const serviceProviders = await serviceProviderService.getServiceProviders(subCategoryId);

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

export const createServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            sendErrorResponse(res, 400, "Request body is required");
            return;
        }

        const { name, bio, workingDays, workingHour, closingHour, phoneContacts, locationLinks, offers } = req.body;
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!name || !bio || !workingDays || !workingHour || !closingHour || !phoneContacts || !locationLinks) {
            sendErrorResponse(res, 400, "All required fields must be provided");
            return;
        }

        let imagesUrl: { url: string; public_id: string }[] = [];

        // Handle File Upload
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const files = req.files as Express.Multer.File[];
            const uploadPromises = files.map(file =>
                serviceProviderService.uploadToCloudinary(file.buffer, 'E-Commerce')
            );

            const results = await Promise.all(uploadPromises);

            results.forEach(result => {
                imagesUrl.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
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
            workingHour,
            closingHour,
            phoneContacts,
            locationLinks,
            offers
        };

        const newServiceProvider = await serviceProviderService.createServiceProvider(subCategoryId, serviceProviderData);
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



export const updateServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceProviderId } = req.params;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider ID is required");
            return;
        }

        // 1. Parse the JSON string from 'data' field
        let updateData: any = {};
        if (req.body.data) {
            try {
                updateData = JSON.parse(req.body.data);
            } catch (e) {
                sendErrorResponse(res, 400, "Invalid JSON in 'data' field");
                return;
            }
        } else {
            // Fallback to spread if no 'data' key, assuming standard fields might be there
            // (Though the plan is to move to 'data', this keeps some safety)
            updateData = { ...req.body };
        }

        const { deletedImageIds } = updateData;

        // Fetch existing provider to get current state
        const existingProvider = await serviceProviderService.getServiceProviderById(serviceProviderId);

        // 2. Start with existing images
        let imagesUrl: { url: string; public_id: string }[] = existingProvider.imagesUrl || [];

        // 3. Handle Deletions
        if (deletedImageIds && Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
            imagesUrl = imagesUrl.filter(img => !deletedImageIds.includes(img.public_id));
        }

        // 4. Handle Additions (Append)
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const files = req.files as Express.Multer.File[];
            const uploadPromises = files.map(file =>
                serviceProviderService.uploadToCloudinary(file.buffer, 'E-Commerce')
            );
            const results = await Promise.all(uploadPromises);
            results.forEach(result => {
                imagesUrl.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            });
        }

        // If we processed any images (deletion or addition), we update the field.
        if ((deletedImageIds && deletedImageIds.length > 0) || (req.files && Array.isArray(req.files) && req.files.length > 0)) {
            updateData.imagesUrl = imagesUrl;
        }

        // Clean up: Remove fields that shouldn't be in the final DB update
        delete updateData.deletedImageIds;

        // Ensure we don't try to update with empty object if nothing was passed (though images might be updated)
        if (Object.keys(updateData).length === 0 && (!req.files || req.files.length === 0)) {
            sendErrorResponse(res, 400, "No update data provided");
            return;
        }

        const updatedServiceProvider = await serviceProviderService.updateServiceProvider(serviceProviderId, updateData);
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

export const deleteServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceProviderId } = req.params;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider ID is required");
            return;
        }

        await serviceProviderService.deleteServiceProvider(serviceProviderId);
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

        const result = await serviceProviderService.uploadToCloudinary(file.buffer, 'E-Commerce');

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

        const imageData = await serviceProviderService.addPhotosToServiceProvider(serviceProviderId, files);
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

export const searchServiceProvidersByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchString } = req.query;
        if (!searchString || typeof searchString !== 'string') {
            sendErrorResponse(res, 400, "Query string is required");
            return;
        }

        const providers = await serviceProviderService.searchServiceProviders(searchString);
        sendSuccessResponse(res, 200, { providers });
    } catch (error: any) {
        console.error("Error searching service providers:", error);
        sendErrorResponse(res, 500, error.message || "Internal server error");
    }
};