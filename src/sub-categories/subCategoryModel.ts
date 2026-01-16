import mongoose, { Schema } from "mongoose";
import { ISubCategory } from "../types/SubCategory.interface";

const subCategorySchema: Schema = new Schema({
    englishName: { type: String, required: true },
    arabicName: { type: String, required: true },
    serviceProvider: [{ type: Schema.Types.Mixed, ref: "serviceProvider", required: false }],
});
export const subCategoryModel = mongoose.model<ISubCategory>("SubCategory", subCategorySchema);