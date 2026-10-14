
import { Router } from "express";
import { generateWebsite } from "../controllers/websiteController.js";

const router = Router();

router.post("/generate", generateWebsite);

export default router;
