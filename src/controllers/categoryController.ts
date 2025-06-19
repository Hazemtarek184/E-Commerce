import { Request, Response } from "express";
import { mainCategoryModel, subCategoryModel } from "../models/categoriesModel";
import * as categoryService from "../services/categoriesService";


export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await mainCategoryModel.find().select('englishName arabicName').lean();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const mainCategoryId = req.params.mainCategoryId;
        if (!mainCategoryId) {
            res.status(400).json({ error: "Sub-category ID is required" });
            return;
        }
        const mainCategory = await mainCategoryModel.findById(mainCategoryId).lean();

        if (!mainCategory) {
            res.status(404).json({ error: "Main category not found" });
            return;
        }

        const subCategories = mainCategory.subCategories.map((subCat: any) => ({
            id: subCat._id,
            englishName: subCat.englishName,
            arabicName: subCat.arabicName
        }));

        res.status(200).json(subCategories);

    } catch (error) {
        console.error("Error fetching sub-categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const serviceProviderId = req.params.serviceProviderId;
        if (!serviceProviderId) {
            res.status(400).json({ error: "Service provider ID is required" });
            return;
        }

        const serviceProviders = await categoryService.getAllServiceProviders();
        res.status(200).json(serviceProviders);
    } catch (error) {
        console.error("Error fetching service providers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }

        const { englishName, arabicName, subCategories } = req.body;

        if (!englishName || !arabicName) {
            res.status(400).json({ error: "English and Arabic names are required" });
            return;
        }

        const newCategoryData = {
            englishName,
            arabicName,
            subCategories: subCategories || []
        };

        const newCategory = new mainCategoryModel(newCategoryData);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createSubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }

        const { englishName, arabicName, serviceProvider } = req.body;
        const mainCategoryId = req.params.mainCategoryId;

        if (!englishName || !arabicName) {
            res.status(400).json({ error: "English and Arabic names are required" });
            return;
        }

        const newSubCategoryData = {
            englishName,
            arabicName,
            serviceProvider: serviceProvider || []
        };

        const newSubCategory = new subCategoryModel(newSubCategoryData);
        await newSubCategory.save();

        const mainCategory = await mainCategoryModel.findById(mainCategoryId);
        if (!mainCategory) {
            res.status(404).json({ error: "Main category not found" });
            return;
        }
        mainCategory.subCategories.push(newSubCategory);
        await mainCategory.save();

        res.status(201).json(newSubCategory);
    } catch (error) {
        console.error("Error creating sub-category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }

        const { name, bio, imagesUrl, workingDays, workingHours, closingHours, phoneConstact, locationLinks, offers } = req.body;

        if (!name || !bio || !imagesUrl || !workingDays || !workingHours || !closingHours || !phoneConstact || !locationLinks) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }


        const subCategoryId = req.params.subCategoryId;
        const subCategory = await subCategoryModel.findById(subCategoryId);

        if (!subCategory) {
            res.status(404).json({ error: "Sub-category not found" });
            return;
        }

        const product = { name, bio, imagesUrl, workingDays, workingHours, closingHours, phoneConstact, locationLinks, offers }
        const newProduct = await categoryService.createProduct(product);


        subCategory.serviceProvider.push(newProduct);
        await subCategory.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.log("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}