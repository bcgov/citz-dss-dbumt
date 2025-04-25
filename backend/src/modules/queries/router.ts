import { Router } from "express";
import {
  getAccountPrivileges,
  getAccountStatus,
  getAccountDetails,
} from "./controllers/oracle";

const router = Router();

router.get("/privileges/:username", getAccountPrivileges);
router.get("/account-status/:username", getAccountStatus);
router.get("/account/:username", getAccountDetails);

export default router;
