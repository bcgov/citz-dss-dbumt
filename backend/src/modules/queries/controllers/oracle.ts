import { Request, Response } from "express";
import {
  getAccountPrivilegesService,
  getAccountStatusService,
  getAccountDetailsService,
} from "../services/queries";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs, ErrorWithCode } from "@/utilities";

const { API } = logs;

/**
 * Returns system privileges for a user
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With information from Oracle
 */
export const getAccountPrivileges = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const data = await getAccountPrivilegesService(username);
    if (!data) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .send("No privileges found");
    }

    return res.status(HTTP_STATUS_CODES.OK).send(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : API.UNEXPECTED_ERR;
    const code =
      err instanceof ErrorWithCode
        ? err.code
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    console.error(API.ERROR_SIMPLE, message);
    return res.status(code).send(message);
  }
};

/**
 * Returns account status for a user
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With information from Oracle
 */
export const getAccountStatus = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const data = await getAccountStatusService(username);
    if (!data) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).send("User not found");
    }

    return res.status(HTTP_STATUS_CODES.OK).send(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : API.UNEXPECTED_ERR;
    const code =
      err instanceof ErrorWithCode
        ? err.code
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    console.error(API.ERROR_SIMPLE, message);
    return res.status(code).send(message);
  }
};

/**
 * Returns account details for user
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With information from Oracle
 */
export const getAccountDetails = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const data = await getAccountDetailsService(username);
    if (!data) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).send("User not found");
    }

    return res.status(HTTP_STATUS_CODES.OK).send(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : API.UNEXPECTED_ERR;
    const code =
      err instanceof ErrorWithCode
        ? err.code
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    console.error(API.ERROR_SIMPLE, message);
    return res.status(code).send(message);
  }
};
