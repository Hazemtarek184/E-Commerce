import { serviceProviderModel } from "../models/serviceProviderModel";
import { CloudinaryUploadResult } from "../types/Cloudinary.interface";
import { IServiceProvider } from "../types/service.provider.interface";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (product: IServiceProvider): Promise<IServiceProvider> => {
    try {
        const newProduct = new serviceProviderModel(product);

        return await newProduct.save();
    }
    catch (error) {
        console.log("Error creating product:", error);
        throw new Error("Error creating product: " + error);
    }
}

export const getAllServiceProviders = async (): Promise<IServiceProvider[]> => {
    try {
        return await serviceProviderModel.find();
    }
    catch (error) {
        console.log("Error fetching products:", error);
        throw new Error("Error fetching products: " + error);
    }
}

export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string = 'uploads'
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