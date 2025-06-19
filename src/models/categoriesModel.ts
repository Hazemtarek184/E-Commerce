import mongoose, { Schema } from "mongoose";
import { IMainCategory, ISubCategory } from "../types/Categories.interface";

const mainCategorySchema: Schema = new Schema({
    englishName: { type: String, required: true },
    arabicName: { type: String, required: true },
    subCategories: [{ type: Schema.Types.Mixed, required: false }],
});
export const mainCategoryModel = mongoose.model<IMainCategory>("MainCategory", mainCategorySchema);

const subCategorySchema: Schema = new Schema({
    englishName: { type: String, required: true },
    arabicName: { type: String, required: true },
    serviceProvider: [{ type: Schema.Types.Mixed, required: false }],
});
export const subCategoryModel = mongoose.model<ISubCategory>("SubCategory", subCategorySchema);

