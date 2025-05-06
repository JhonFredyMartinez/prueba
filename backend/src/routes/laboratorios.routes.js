import { Router } from "express";
import { mthodHTTP as laboratoriocontrolller } from "../controllers/laboratorios.controllers.js";

const router = Router();


router.get("/",laboratoriocontrolller.getlaboratorios)
router.post("/",laboratoriocontrolller.postlaboratoriosADMIN)
router.put("/",laboratoriocontrolller.updatelaboratoriosADMIN)
router.delete("/",laboratoriocontrolller.deletelaboratoriosADMIN)



export default router;