import { Router } from "express";
import { addRequirement } from "./controllers/requirements";

const router = Router();

router.route(`/requirement`).post(addRequirement);

export default router;
