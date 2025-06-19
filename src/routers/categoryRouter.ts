import express from "express";
import * as categoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/categories", categoryController.getCategories);
router.get("/sub-categories/:mainCategoryId", categoryController.getSubCategories);
router.get("/service-provider/:serviceProviderId", categoryController.getServiceProvider);

router.get("test", (req, res) => {
    res.send("Test route is working");
}
);

router.post("/categories", categoryController.createCategory);
router.post("/sub-categories/:mainCategoryId", categoryController.createSubCategory);
router.post("/service-provider/:subCategoryId", categoryController.createServiceProvider);

export default router;
