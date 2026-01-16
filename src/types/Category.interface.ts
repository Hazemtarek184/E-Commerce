import { Types } from "mongoose";

export interface IMainCategory {
    englishName: string;
    arabicName: string;
    subCategories: Types.ObjectId[];
}