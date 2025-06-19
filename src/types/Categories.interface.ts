import { IServiceProvider } from "./service.provider.interface";

export interface IMainCategory{
    englishName: string;
    arabicName: string;
    subCategories: ISubCategory[];
}

export interface ISubCategory{
    englishName: string;
    arabicName: string;
    serviceProvider: IServiceProvider[];
}
