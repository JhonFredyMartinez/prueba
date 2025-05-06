import { Router } from "express";
import { mthodHTTP as logincontrolller } from "../controllers/login.controller.js";

const router = Router();


router.post("/",logincontrolller.postlogin)




export default router;