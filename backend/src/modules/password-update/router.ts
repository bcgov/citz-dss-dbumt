import { Router } from "express";
import { addRequirement, findReqByName, getAllReq } from "./controllers/requirements";

const router = Router();

router.route(`/requirement`).get(getAllReq).post(addRequirement);
router.route(`/requirement/:name`).get(findReqByName);

export default router;
