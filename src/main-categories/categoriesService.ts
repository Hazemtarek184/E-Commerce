import { mainCategoryModel } from "./categoriesModel";
import { serviceProviderModel } from "../service-provider/serviceProviderModel";
import { IMainCategory } from "../types/Category.interface";
import { isValidObjectId } from "../utils/validation";
import { subCategoryModel } from "../sub-categories/subCategoryModel";

// GET Operations
export const getAllCategories = async () => {
    return await mainCategoryModel.aggregate([
        {
            $project: {
                englishName: 1,
                arabicName: 1,
                // Create a new field that counts the array length
                subCategoryCount: {
                    $size: { $ifNull: ["$subCategories", []] }
                }
            }
        }
    ]);
};

// CREATE Operations
export const createCategory = async (englishName: string, arabicName: string) => {
    return await mainCategoryModel.create({ englishName, arabicName });
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
