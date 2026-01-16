import { Types } from "mongoose";

export interface ISubCategory {
    englishName: string;
    arabicName: string;
    serviceProvider: Types.ObjectId[];
}