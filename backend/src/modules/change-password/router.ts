import { Router } from "express";
import { changePasswordController } from "./controllers";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

const router = Router();

// POST /changePassword
router.post("/", changePasswordController);

// Health check
router.get("/health", (req, res) => {
  console.log(`${logs.API.HEALTH_CHECK} /changePassword/health`);
  res.status(HTTP_STATUS_CODES.OK).send("Change Password Healthy");
});

export default router;
