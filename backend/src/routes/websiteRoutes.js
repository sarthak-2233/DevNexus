
import { Router } from "express";
import { generateWebsite } from "../controllers/websiteController.js";
import { downloadProject } from "../controllers/projectController.js";

const router = Router();

router.post("/generate", generateWebsite);
router.get("/:projectId/download", downloadProject);

export default router;
