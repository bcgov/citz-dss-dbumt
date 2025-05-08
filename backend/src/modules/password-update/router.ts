import { Router } from "express";
import {
  addRequirement,
  findReqByName,
  getAllReq,
} from "./controllers/requirements";
import { HTTP_STATUS_CODES } from "@/constants";

const router = Router();

router.route(`/requirement`).get(getAllReq).post(addRequirement);
router.route(`/requirement/:name`).get(findReqByName);

// Health check route
router.route('/health').get((req, res) => {
  return res.status(HTTP_STATUS_CODES.OK).send("PAssword Update Healthy");
});

export default router;
