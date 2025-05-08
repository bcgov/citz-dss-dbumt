import { Router } from "express";
import { HTTP_STATUS_CODES } from "@/constants";

const router = Router();

router.route("/server").get((req, res) => {
  return res.status(HTTP_STATUS_CODES.OK).send("Server Healthy");
});

export default router;
