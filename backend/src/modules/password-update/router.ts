import { Router } from "express";
import {
  addRequirement,
  findReqByName,
  getAllReq,
} from "./controllers/requirements";
import {
  checkPassword,
  updateUserPassword,
} from "./controllers/passwordUpdate";

const router = Router();

router.route(`/requirement`).get(getAllReq).post(addRequirement);
router.route(`/requirement/:name`).get(findReqByName);

router.post("/check", checkPassword);
router.post("/update", updateUserPassword);

export default router;
