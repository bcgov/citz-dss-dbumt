import { Request, Response } from "express";
import { checkOracleIdAcrossEnvs } from "../services//verify";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

/**
 * Handle request to check if an user exists in multiple environments,
 * and return expiry dates.
 */
export const verifyOracleId = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("Missing required parameter: username");
  }

  let userEnvData;
  try {
    userEnvData = await checkOracleIdAcrossEnvs(username);
  } catch (err) {
    let err_message = `${logs.API.UNEXPECTED_ERR}`;
    if (err instanceof Error) err_message = err.message;
    console.error(logs.API.ERROR_SIMPLE, err_message);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(err_message);
  }

  console.log(logs.ORACLE.ENTITY_FOUND, username);
  return res.status(HTTP_STATUS_CODES.OK).send(userEnvData);
};
