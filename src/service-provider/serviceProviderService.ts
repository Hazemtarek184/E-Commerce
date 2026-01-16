import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from "../types/Cloudinary.interface";
import { IServiceProvider } from "../types/service.provider.interface";
import { isValidObjectId } from "../utils/validation";
import { serviceProviderModel } from './serviceProviderModel';
import { subCategoryModel } from '../sub-categories/subCategoryModel';

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

export const getServiceProviderById = async (serviceProviderId: string) => {
    if (!isValidObjectId(serviceProviderId)) {
        throw new Error("Invalid service provider ID format");
    }
    const serviceProvider = await serviceProviderModel.findById(serviceProviderId);
    if (!serviceProvider) {
        throw new Error("Service provider not found");
    }
    return serviceProvider;
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

export const searchServiceProviders = async (searchString: string) => {
    const regex = new RegExp(searchString, 'i');
    return await serviceProviderModel.find({ name: regex });
};
