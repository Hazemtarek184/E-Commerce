import { mainCategoryModel, subCategoryModel } from "./categoriesModel";
import { serviceProviderModel } from "../models/serviceProviderModel";
import { Types } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from "../types/Cloudinary.interface";
import { IMainCategory, ISubCategory } from "../types/Categories.interface";
import { IServiceProvider } from "../types/service.provider.interface";

// Utility for ObjectId validation
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

// Cloudinary Helper
export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string = 'E-Commerce'
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result as CloudinaryUploadResult);
                else reject(new Error('Upload failed: No result'));
            }
        ).end(buffer);
    });
};

// GET Operations
export const getAllCategories = async () => {
    return await mainCategoryModel.find().select('englishName arabicName').lean();
};

export const getSubCategories = async (mainCategoryId: string) => {
    if (!isValidObjectId(mainCategoryId)) {
        throw new Error("Invalid main category ID format");
    }

    const mainCategory = await mainCategoryModel.findById(mainCategoryId).populate('subCategories', '-serviceProvider').lean();

    if (!mainCategory) {
        throw new Error("Main category not found");
    }

    return mainCategory.subCategories;
};

export const getServiceProviders = async (subCategoryId: string) => {
    if (!isValidObjectId(subCategoryId)) {
        throw new Error("Invalid sub-category ID format");
    }

    const subCategory = await subCategoryModel
        .findById(subCategoryId)
        .populate('serviceProvider')
        .lean();

    if (!subCategory) {
        throw new Error("Sub-category not found");
    }

    return subCategory.serviceProvider;
};

export const searchServiceProviders = async (searchString: string) => {
    const regex = new RegExp(searchString, 'i');
    return await serviceProviderModel.find({ name: regex });
};

// CREATE Operations
export const createCategory = async (englishName: string, arabicName: string) => {
    return await mainCategoryModel.create({ englishName, arabicName });
};

export const createSubCategory = async (mainCategoryId: string, englishName: string, arabicName: string) => {
    if (!isValidObjectId(mainCategoryId)) {
        throw new Error("Invalid main category ID format");
    }

    const mainCategory = await mainCategoryModel.findById(mainCategoryId);
    if (!mainCategory) {
        throw new Error("Main category not found");
    }

    const newSubCategory = await subCategoryModel.create({ englishName, arabicName });

    mainCategory.subCategories.push(newSubCategory._id);
    await mainCategory.save();

    return newSubCategory;
};

export const createServiceProvider = async (subCategoryId: string, data: IServiceProvider) => {
    if (!isValidObjectId(subCategoryId)) {
        throw new Error("Invalid sub-category ID format");
    }

    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        throw new Error("Sub-category not found");
    }

    const newServiceProvider = await serviceProviderModel.create(data);

    subCategory.serviceProvider.push(newServiceProvider._id);
    await subCategory.save();

    return newServiceProvider;
};

// UPDATE Operations
export const updateCategory = async (categoryId: string, updateData: Partial<IMainCategory>) => {
    if (!isValidObjectId(categoryId)) {
        throw new Error("Invalid category ID format");
    }

    const updatedCategory = await mainCategoryModel.findByIdAndUpdate(
        categoryId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        throw new Error("Category not found");
    }

    return updatedCategory;
};

export const updateSubCategory = async (subCategoryId: string, updateData: Partial<ISubCategory>) => {
    if (!isValidObjectId(subCategoryId)) {
        throw new Error("Invalid sub-category ID format");
    }

    const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
        subCategoryId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
        throw new Error("Sub-category not found");
    }

    return updatedSubCategory;
};

export const updateServiceProvider = async (serviceProviderId: string, updateData: Partial<IServiceProvider>) => {
    if (!isValidObjectId(serviceProviderId)) {
        throw new Error("Invalid service provider ID format");
    }

    const updatedServiceProvider = await serviceProviderModel.findByIdAndUpdate(
        serviceProviderId,
        { $set: updateData },
        { new: true }
    );

    if (!updatedServiceProvider) {
        throw new Error("Service provider not found");
    }

    return updatedServiceProvider;
};

// DELETE Operations
export const deleteCategory = async (categoryId: string) => {
    if (!isValidObjectId(categoryId)) {
        throw new Error("Invalid category ID format");
    }

    const category = await mainCategoryModel.findById(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }

    // Delete associated data
    for (const subCategoryId of category.subCategories) {
        const subCategory = await subCategoryModel.findById(subCategoryId);
        if (!subCategory) continue;

        for (const serviceProviderId of subCategory.serviceProvider) {
            await serviceProviderModel.findByIdAndDelete(serviceProviderId);
        }
        await subCategory.deleteOne();
    }

    await category.deleteOne();
};

export const deleteSubCategory = async (subCategoryId: string) => {
    if (!isValidObjectId(subCategoryId)) {
        throw new Error("Invalid sub-category ID format");
    }

    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        throw new Error("Sub-category not found");
    }

    for (const serviceProviderId of subCategory.serviceProvider) {
        await serviceProviderModel.findByIdAndDelete(serviceProviderId);
    }

    await subCategory.deleteOne();
};

export const deleteServiceProvider = async (serviceProviderId: string) => {
    if (!isValidObjectId(serviceProviderId)) {
        throw new Error("Invalid service provider ID format");
    }

    const serviceProvider = await serviceProviderModel.findById(serviceProviderId);
    if (!serviceProvider) {
        throw new Error("Service provider not found");
    }

    await serviceProvider.deleteOne();
};

// PHOTO Operations
export const addPhotosToServiceProvider = async (serviceProviderId: string, files: Express.Multer.File[]) => {
    if (!isValidObjectId(serviceProviderId)) {
        throw new Error("Invalid service provider ID format");
    }

    const serviceProvider = await serviceProviderModel.findById(serviceProviderId);
    if (!serviceProvider) {
        throw new Error("No service provider found");
    }

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

    return imageData;
};
