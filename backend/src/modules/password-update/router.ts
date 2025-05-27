import { Router } from "express";
import { addRequirement, findReqByName, getAllReq, updateRequirement } from "./controllers";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

const router = Router();

router.route(`/requirement`).get(getAllReq).post(addRequirement);
router.route(`/requirement/:name`).get(findReqByName).post(updateRequirement);

// Health check route
router.route("/health").get((req, res) => {
  console.log(logs.API.HEALTH_CHECK + " /passwordUpdate/health");
  return res.status(HTTP_STATUS_CODES.OK).send("Password Update Healthy");
});

export default router;
