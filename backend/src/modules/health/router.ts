import { Router } from "express";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

const router = Router();

router.route("/server").get((req, res) => {
  console.log("TESTING");
  console.log(logs.API.HEALTH_CHECK + " /health/server");
  return res.status(HTTP_STATUS_CODES.OK).send("Server Healthy");
});

export default router;
