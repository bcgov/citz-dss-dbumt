import { Request, Response } from "express";
import { getQueryResults } from "../services/query";
import { generatePdf } from "../services/queryPdf";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";
import { getEnvironmentsByName } from "@/config/oracleEnvironments";
import { PdfQueryResults } from "../types/pdfQueryResults";

/**
 * Handle request to query an oracle user ID in multiple Oracle environments and
 * return their information.
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With user ID verification
 */
export const queryOracleId = async (req: Request, res: Response) => {
  const requiredParams = ["username", "envs", "queries"];
  const missingParams = requiredParams.filter((param) => {
    const value = req.body[param];
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  if (missingParams.length > 0) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send(`Missing required parameters: ${missingParams.join(", ")}`);
  }

  const { username, envs, queries } = req.body;
  const upperUsername = username.toUpperCase();
  const selectedEnvs = getEnvironmentsByName(envs);

  if (selectedEnvs.length === 0) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("No valid environments provided.");
  }

  if (envs.length !== selectedEnvs.length) {
    console.warn(
      `${logs.ORACLE.INVALID_ENV} ${envs.filter((env: string) => !selectedEnvs.some((e) => e.name.toUpperCase() === env.toUpperCase())).join(", ")}`,
    );
  }

  const user = req.user || null;
  const { results, message } = await getQueryResults(
    user,
    upperUsername,
    selectedEnvs,
    queries,
  );
  if (results.length === 0) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).send(message);
  } else {
    return res.status(HTTP_STATUS_CODES.OK).send(results);
  }
};

/**
 * @summary Download a report as a PDF
 * @param req - The request object
 * @param res - The response object
 * @returns A PDF file
 */
export const downloadReportPdf = async (req: Request, res: Response) => {
  try {
    const results = req.body.results as PdfQueryResults[];

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ message: "Invalid results" });
    }

    const pdfBuffer = await generatePdf(results);
    const buffer = Buffer.from(pdfBuffer);

    if (!buffer || buffer.length === 0) {
      throw new Error("Generated PDF is empty");
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="account-report.pdf"',
      "Content-Length": buffer.length,
    });

    return res.status(200).send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};
