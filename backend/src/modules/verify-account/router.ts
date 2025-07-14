import { Router } from "express";
import { verifyOracleId } from "./controllers";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

const router = Router();

router.route(`/verify`).post(verifyOracleId);

// Health check route
router.route("/health").get((req, res) => {
  console.log(logs.API.HEALTH_CHECK + " /verifyAccount/health");
  return res
    .status(HTTP_STATUS_CODES.OK)
    .send("Verify Account Service Healthy");
});

export default router;
