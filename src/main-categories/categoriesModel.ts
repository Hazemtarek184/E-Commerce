import mongoose, { Schema } from "mongoose";
import { IMainCategory } from "../types/Category.interface";

const mainCategorySchema: Schema = new Schema({
    englishName: { type: String, required: true },
    arabicName: { type: String, required: true },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory", required: false }],
});
export const mainCategoryModel = mongoose.model<IMainCategory>("MainCategory", mainCategorySchema);