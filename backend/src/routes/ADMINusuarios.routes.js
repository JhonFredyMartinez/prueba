import { Router } from "express";
import { mthodHTTP as ADMINusuarioscontrolller } from "../controllers/ADMINusuarios.controllers.js";

const router = Router();


router.get("/",ADMINusuarioscontrolller.getADMINusuarios)



export default router;