import { Request, Response } from "express";
import { getUserExpiry } from "../services/verify";
import { HTTP_STATUS_CODES } from "@/constants";
import { getEnvironmentsByName } from "@/config/oracleEnvironments";

/**
 * Handle request to check if an user exists in multiple environments,
 * and return expiry dates.
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With user ID verification
 */
export const verifyOracleId = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("Missing required parameter: username");
  }

  const upperUsername = username.toUpperCase();

  const selectedEnvs = getEnvironmentsByName(["DEV", "TEST", "PROD"]);
  const { results, message } = await getUserExpiry(upperUsername, selectedEnvs);
  if (results.length === 0) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).send(message);
  }
  else {
      return res.status(HTTP_STATUS_CODES.OK).send(results);
  }
};