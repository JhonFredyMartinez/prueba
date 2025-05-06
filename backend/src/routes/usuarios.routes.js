import { Router } from "express";
import { mthodHTTP as usuariocontrolller } from "../controllers/usuarios.controllers.js";
const router = Router();

router.post("/",usuariocontrolller.postUsuarios)


export default router;
