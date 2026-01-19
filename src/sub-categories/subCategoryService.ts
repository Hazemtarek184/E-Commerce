import { mainCategoryModel } from "../main-categories/categoriesModel";
import { subCategoryModel } from "./subCategoryModel";
import { isValidObjectId } from "../utils/validation";
import { ISubCategory } from "../types/SubCategory.interface";
import { serviceProviderModel } from "../service-provider/serviceProviderModel";
import { Types } from "mongoose";

// export const getSubCategories = async (mainCategoryId: string) => {
//     if (!isValidObjectId(mainCategoryId)) {
//         throw new Error("Invalid main category ID format");
//     }

//     const mainCategory = await mainCategoryModel.findById(mainCategoryId).populate('subCategories', '-serviceProvider').lean();

//     if (!mainCategory) {
//         throw new Error("Main category not found");
//     }

//     return mainCategory.subCategories;
// };

export const getSubCategories = async (mainCategoryId: string) => {
    // 1. Validation
    if (!isValidObjectId(mainCategoryId)) {
        throw new Error("Invalid main category ID format");
    }

    // 2. Fetch Main Category & Fill in SubCategory details
    const mainCategory = await mainCategoryModel
        .findById(mainCategoryId)
        .populate("subCategories") // This turns the IDs into actual objects
        .lean();

    // 3. Check if found
    if (!mainCategory) {
        throw new Error("Main category not found");
    }

    // 4. Transform the data
    // We handle the case where subCategories might be null/undefined safely
    const list = mainCategory.subCategories || [];

    return list.map((sub: any) => ({
        _id: sub._id,
        englishName: sub.englishName,
        arabicName: sub.arabicName,
        // We simply count the IDs in the array
        serviceProviderCount: sub.serviceProvider ? sub.serviceProvider.length : 0
    }));
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