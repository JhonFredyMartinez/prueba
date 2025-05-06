import { Router } from "express";
import { mthodHTTP as ADMINproductoscontrolller } from "../controllers/ADMINproductos.controllers.js";
import upload from '../middleware/multer.js';  // tu config multer

const router = Router();


router.get("/",ADMINproductoscontrolller.getProductosADMIN);
router.post("/", upload.single('imagen'), ADMINproductoscontrolller.postProductosADMIN);
router.put("/", upload.single('imagen'), ADMINproductoscontrolller.updateProductosADMIN);
router.delete("/",ADMINproductoscontrolller.deleteProductosADMIN);



export default router;