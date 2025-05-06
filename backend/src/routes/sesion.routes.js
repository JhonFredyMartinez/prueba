import { Router } from "express";
import { mthodHTTP as logincontrolller } from "../controllers/login.controller.js";

const router = Router();


router.get("/me",logincontrolller.getMe)



export default router;