import express from "express";
import { upload } from "../config/multer-config";
import * as serviceProviderController from "./serviceProviderController";

const router = express.Router();

router.get("/service-providers/:subCategoryId", serviceProviderController.getServiceProvider);
router.post("/service-providers/:subCategoryId", upload.array('image', 10), serviceProviderController.createServiceProvider);

router.put("/service-providers/:serviceProviderId", upload.array('image', 10), serviceProviderController.updateServiceProvider);
router.delete("/service-providers/:serviceProviderId", serviceProviderController.deleteServiceProvider);

router.get("/search-providers", serviceProviderController.searchServiceProvidersByName);

router.get("/upload-provider-photo", upload.single('photo'), serviceProviderController.uploadPhoto);

router.post("/upload-provider-photos", upload.array('photos', 10), serviceProviderController.uploadPhotos);

export default router;