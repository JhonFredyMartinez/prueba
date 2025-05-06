import express from "express";
import { mthodHTTP as logoutController } from "../controllers/logout.controller.js";

const router = express.Router();

router.post("/logout", logoutController.logout);

export default router;
