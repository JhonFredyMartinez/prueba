import { Router } from "express";
import { mthodHTTP as categoriacontrolller } from "../controllers/categorias.controllers.js";

const router = Router();


router.get("/",categoriacontrolller.getcategorias)
router.post("/",categoriacontrolller.postcategoriasADMIN)
router.put("/",categoriacontrolller.updatecategoriasADMIN)
router.delete("/",categoriacontrolller.deletecategoriasADMIN)



export default router;