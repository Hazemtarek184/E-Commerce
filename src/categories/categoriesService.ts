import { serviceProviderModel } from "../models/serviceProviderModel";
import { IServiceProvider } from "../types/service.provider.interface";

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
