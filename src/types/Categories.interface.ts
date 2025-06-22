import { Types } from "mongoose";

export interface IMainCategory {
    englishName: string;
    arabicName: string;
    subCategories: Types.ObjectId[];
}

export interface ISubCategory {
    englishName: string;
    arabicName: string;
    serviceProvider: Types.ObjectId[];
}
