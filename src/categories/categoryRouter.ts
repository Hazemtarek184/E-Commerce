import express from "express";
import * as categoryController from "./categoryController";

const router = express.Router();

router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:categoryId", categoryController.updateMainCategory);
router.delete("/categories/:categoryId", categoryController.deleteMainCategory);

router.get("/sub-categories/:mainCategoryId", categoryController.getSubCategories);
router.post("/sub-categories/:mainCategoryId", categoryController.createSubCategory);
router.put("/sub-categories/:subCategoryId", categoryController.updateSubCategory);
router.delete("/sub-categories/:subCategoryId", categoryController.deleteSubCategory);

router.get("/service-providers/:subCategoryId", categoryController.getServiceProvider);
router.post("/service-providers/:subCategoryId", categoryController.createServiceProvider);
router.put("/service-providers/:serviceProviderId", categoryController.updateServiceProvider);
router.delete("/service-providers/:serviceProviderId", categoryController.deleteServiceProvider);

router.get("/search-providers", categoryController.searchServiceProvidersByName);

export default router;