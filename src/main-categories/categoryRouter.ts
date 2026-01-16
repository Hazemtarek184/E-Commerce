import express from "express";
import * as categoryController from "./categoryController";

const router = express.Router();

router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.createCategory);

router.put("/categories/:categoryId", categoryController.updateMainCategory);
router.delete("/categories/:categoryId", categoryController.deleteMainCategory);

export default router;