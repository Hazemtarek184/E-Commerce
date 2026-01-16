import express from "express";
import * as subCategoryController from "./subCategoryController";

const router = express.Router();

router.get("/sub-categories/:mainCategoryId", subCategoryController.getSubCategories);
router.post("/sub-categories/:mainCategoryId", subCategoryController.createSubCategory);

router.put("/sub-categories/:subCategoryId", subCategoryController.updateSubCategory);
router.delete("/sub-categories/:subCategoryId", subCategoryController.deleteSubCategory);

export default router;