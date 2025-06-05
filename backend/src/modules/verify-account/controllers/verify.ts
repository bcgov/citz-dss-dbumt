import { Request, Response } from "express";
import { checkOracleIdAcrossEnvs } from "../services//verify";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

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
  //TODO: add sanitization for requests that come directly from users
  if (!username) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("Missing required parameter: username");
  }

  try {
    const envs = await checkOracleIdAcrossEnvs(username);
    console.log(logs.ORACLE.ENTITY_FOUND, username);
    return res.status(HTTP_STATUS_CODES.OK).send(envs);
  } catch (err) {
    const isCustom = err instanceof ErrorWithCode;
    const message = isCustom ? err.message : logs.API.UNEXPECTED_ERR;
    const status = isCustom
      ? (err.code ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    console.error(logs.API.ERROR_SIMPLE, message);
    return res.status(status).send(message);
  }
};
