import { Router } from "express";
import { mthodHTTP as productocontrolller } from "../controllers/productos.controllers.js";

const router = Router();


router.get("/",productocontrolller.getproductos)



export default router;
