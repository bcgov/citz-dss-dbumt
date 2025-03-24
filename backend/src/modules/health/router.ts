import { Router } from "express";
import { serverHealth } from "./controller.ts";

const router = Router();

router.get("/server", serverHealth);

export default router;
