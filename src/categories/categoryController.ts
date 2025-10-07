import { Request, Response } from "express";
import { mainCategoryModel, subCategoryModel } from "./categoriesModel";
import { serviceProviderModel } from "../models/serviceProviderModel";
import { Types } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from "../types/Cloudinary.interface";
import { uploadToCloudinary } from "./categoriesService";

// Utility function for ObjectId validation
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

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
        const categories = await mainCategoryModel.find().select('englishName arabicName').lean();
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

        if (!isValidObjectId(mainCategoryId)) {
            sendErrorResponse(res, 400, "Invalid main category ID format");
            return;
        }

        const mainCategory = await mainCategoryModel.findById(mainCategoryId).populate('subCategories').lean();

        if (!mainCategory) {
            sendErrorResponse(res, 404, "Main category not found");
            return;
        }

        const subCategories = mainCategory.subCategories;

        sendSuccessResponse(res, 200, { subCategories });
    } catch (error) {
        console.error("Error fetching sub-categories:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

export const getServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!isValidObjectId(subCategoryId)) {
            sendErrorResponse(res, 400, "Invalid sub-category ID format");
            return;
        }

        const subCategory = await subCategoryModel
            .findById(subCategoryId)
            .populate('serviceProvider')
            .lean();

        if (!subCategory) {
            sendErrorResponse(res, 404, "Sub-category not found");
            return;
        }

        if (!subCategory.serviceProvider || subCategory.serviceProvider.length === 0) {
            sendSuccessResponse(res, 200, { serviceProviders: [] }, "No service providers found for this sub-category");
            return;
        }

        sendSuccessResponse(res, 200, {
            serviceProviders: subCategory.serviceProvider,
            subCategoryInfo: {
                id: subCategory._id,
                englishName: subCategory.englishName,
                arabicName: subCategory.arabicName
            }
        });

    } catch (error) {
        console.error("Error fetching service providers:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

export const searchServiceProvidersByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchString } = req.query;
        if (!searchString || typeof searchString !== 'string') {
            sendErrorResponse(res, 400, "Query string is required");
            return;
        }
        // Use a case-insensitive regex for substring search (supports English and Arabic)
        const regex = new RegExp(searchString, 'i');
        const providers = await serviceProviderModel.find({ name: regex });
        sendSuccessResponse(res, 200, { providers });
    } catch (error) {
        console.error("Error searching service providers:", error);
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

        const newCategoryData = {
            englishName,
            arabicName
        };

        const newCategory = await mainCategoryModel.create(newCategoryData);
        sendSuccessResponse(res, 201, { category: newCategory }, "Category created successfully");
    } catch (error) {
        console.error("Error creating category:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(mainCategoryId)) {
            sendErrorResponse(res, 400, "Invalid main category ID format");
            return;
        }

        if (!englishName || !arabicName) {
            sendErrorResponse(res, 400, "English name and Arabic name are required");
            return;
        }

        const mainCategory = await mainCategoryModel.findById(mainCategoryId);
        if (!mainCategory) {
            sendErrorResponse(res, 404, "Main category not found");
            return;
        }

        const newSubCategoryData = {
            englishName,
            arabicName
        };

        const newSubCategory = await subCategoryModel.create(newSubCategoryData);

        mainCategory.subCategories.push(newSubCategory._id);
        await mainCategory.save();

        sendSuccessResponse(res, 201, { subCategory: newSubCategory }, "Sub category created successfully");
    } catch (error) {
        console.error("Error creating sub category:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

export const createServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            sendErrorResponse(res, 400, "Request body is required");
            return;
        }

        const { name, bio, imagesUrl, workingDays, workingHours, closingHours, phoneContact, locationLinks, offers } = req.body;
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!isValidObjectId(subCategoryId)) {
            sendErrorResponse(res, 400, "Invalid sub-category ID format");
            return;
        }

        if (!name || !bio || !workingDays || !workingHours || !closingHours || !phoneContact || !locationLinks) {
            sendErrorResponse(res, 400, "All required fields must be provided");
            return;
        }

        if (imagesUrl && (!imagesUrl.url || !imagesUrl.public_id)) {
            sendErrorResponse(res, 400, "Image url format is invalid");
            return;
        }

        const subCategory = await subCategoryModel.findById(subCategoryId);

        if (!subCategory) {
            sendErrorResponse(res, 404, "Sub-category not found");
            return;
        }

        const serviceProviderData = {
            name,
            bio,
            imagesUrl,
            workingDays,
            workingHours,
            closingHours,
            phoneContact,
            locationLinks,
            offers
        };

        const newServiceProvider = await serviceProviderModel.create(serviceProviderData);

        subCategory.serviceProvider.push(newServiceProvider._id);
        await subCategory.save();

        sendSuccessResponse(res, 201, { serviceProvider: newServiceProvider }, "Service provider created successfully");
    } catch (error) {
        console.error("Error creating service provider:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(categoryId)) {
            sendErrorResponse(res, 400, "Invalid category ID format");
            return;
        }

        if (!englishName && !arabicName) {
            sendErrorResponse(res, 400, "At least one field (English or Arabic name) is required");
            return;
        }

        const updateData: any = {};
        if (englishName) updateData.englishName = englishName;
        if (arabicName) updateData.arabicName = arabicName;

        const updatedCategory = await mainCategoryModel.findByIdAndUpdate(
            categoryId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            sendErrorResponse(res, 404, "Category not found");
            return;
        }

        sendSuccessResponse(res, 200, { category: updatedCategory }, "Category updated successfully");

    } catch (error) {
        console.error("Error updating category:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(subCategoryId)) {
            sendErrorResponse(res, 400, "Invalid sub-category ID format");
            return;
        }

        if (!englishName && !arabicName) {
            sendErrorResponse(res, 400, "At least one field (English or Arabic name) is required");
            return;
        }

        const updateData: any = {};
        if (englishName) updateData.englishName = englishName;
        if (arabicName) updateData.arabicName = arabicName;

        const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
            subCategoryId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedSubCategory) {
            sendErrorResponse(res, 404, "Sub-category not found");
            return;
        }

        sendSuccessResponse(res, 200, { subCategory: updatedSubCategory }, "Sub-category updated successfully");
    } catch (error) {
        console.error("Error updating sub-category:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(serviceProviderId)) {
            sendErrorResponse(res, 400, "Invalid service provider ID format");
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

        const updatedServiceProvider = await serviceProviderModel.findByIdAndUpdate(
            serviceProviderId,
            { $set: updateData },
            {
                new: true
                // , runValidators: true
            }
        );

        if (!updatedServiceProvider) {
            sendErrorResponse(res, 404, "Service provider not found");
            return;
        }

        sendSuccessResponse(res, 200, { serviceProvider: updatedServiceProvider }, "Service provider updated successfully");

    } catch (error) {
        console.error("Error updating service provider:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(categoryId)) {
            sendErrorResponse(res, 400, "Invalid category ID format");
            return;
        }

        const category = await mainCategoryModel.findById(categoryId);

        if (!category) {
            sendErrorResponse(res, 404, "Category not found");
            return;
        }

        // Delete all associated service providers first
        for (const subCategoryId of category.subCategories) {
            const subCategory = await subCategoryModel.findById(subCategoryId);
            if (!subCategory) {
                continue;
            }

            for (const serviceProviderId of subCategory.serviceProvider) {
                await serviceProviderModel.findByIdAndDelete(serviceProviderId);
            }

            await subCategory.deleteOne();
        }

        await category.deleteOne();
        sendSuccessResponse(res, 200, null, "Category and all associated data deleted successfully");
    } catch (error) {
        console.error("Error deleting category:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

export const deleteSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subCategoryId } = req.params;

        if (!subCategoryId) {
            sendErrorResponse(res, 400, "Sub-category ID is required");
            return;
        }

        if (!isValidObjectId(subCategoryId)) {
            sendErrorResponse(res, 400, "Invalid sub-category ID format");
            return;
        }

        const subCategory = await subCategoryModel.findById(subCategoryId);

        if (!subCategory) {
            sendErrorResponse(res, 404, "Sub-category not found");
            return;
        }

        // Delete all associated service providers first
        for (const serviceProviderId of subCategory.serviceProvider) {
            await serviceProviderModel.findByIdAndDelete(serviceProviderId);
        }

        await subCategory.deleteOne();
        sendSuccessResponse(res, 200, null, "Sub-category and all associated data deleted successfully");
    } catch (error) {
        console.error("Error deleting sub-category:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};

export const deleteServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceProviderId } = req.params;

        if (!serviceProviderId) {
            sendErrorResponse(res, 400, "Service provider ID is required");
            return;
        }

        if (!isValidObjectId(serviceProviderId)) {
            sendErrorResponse(res, 400, "Invalid service provider ID format");
            return;
        }

        const serviceProvider = await serviceProviderModel.findById(serviceProviderId);

        if (!serviceProvider) {
            sendErrorResponse(res, 404, "Service provider not found");
            return;
        }

        await serviceProvider.deleteOne();
        sendSuccessResponse(res, 200, null, "Service provider deleted successfully");
    } catch (error) {
        console.error("Error deleting service provider:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};


export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        if (!file) {
            sendErrorResponse(res, 400, "No photo uploaded");
            return;
        }

        // const { serviceProviderId } = req.body;
        // if (!serviceProviderId) {
        //     sendErrorResponse(res, 400, "Service provider id is missing");
        //     return;
        // }

        // if (!isValidObjectId(serviceProviderId)) {
        //     sendErrorResponse(res, 400, "Service provider id format is wrong");
        //     return;
        // }

        // const serviceProvider = await serviceProviderModel.findById(serviceProviderId);
        // if (!serviceProvider) {
        //     sendErrorResponse(res, 400, "No service provider found");
        //     return;
        // }

        const result = await uploadToCloudinary(file.buffer, 'E-Commerce');

        const imageData = {
            url: result.secure_url,
            public_id: result.public_id
        };

        // serviceProvider.imagesUrl.push(imageData);
        // await serviceProvider.save();

        sendSuccessResponse(res, 201, imageData, "Photo stored successfully");
    } catch (error) {
        console.error("Error uploading failed:", error);
        sendErrorResponse(res, 500, "Internal server error");
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

        if (!isValidObjectId(serviceProviderId)) {
            sendErrorResponse(res, 400, "Service provider id format is wrong");
            return;
        }

        const serviceProvider = await serviceProviderModel.findById(serviceProviderId);
        if (!serviceProvider) {
            sendErrorResponse(res, 400, "No service provider found");
            return;
        }

        // Upload all photos to Cloudinary
        const uploadPromises = files.map(file =>
            uploadToCloudinary(file.buffer, 'E-Commerce')
        );

        const results = await Promise.all(uploadPromises);

        const imageData = results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));

        serviceProvider.imagesUrl.push(...imageData);
        await serviceProvider.save();

        sendSuccessResponse(res, 201, imageData, "Photos stored successfully");
    } catch (error) {
        console.error("Error uploading failed:", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
};