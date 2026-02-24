import { Router } from "express";
import { queryOracleId, downloadReportPdf } from "./controllers";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

const router = Router();

router.route(`/query`).post(queryOracleId);
router.route(`/generatePdf`).post(downloadReportPdf);

// Health check route
router.route("/health").get((req, res) => {
  console.log(logs.API.HEALTH_CHECK + " /queryAccount/health");
  return res.status(HTTP_STATUS_CODES.OK).send("Query Account Service Healthy");
});

export default router;
