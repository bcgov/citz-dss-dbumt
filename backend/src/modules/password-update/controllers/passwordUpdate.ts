import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs, ErrorWithCode } from "@/utilities";
import { validatePassword, updatePassword } from "../services/passwordUpdate";

const { ORACLE, API } = logs;

/**
 * Check whether a password meets all active validation rules
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 */
export const checkPassword = async (req: Request, res: Response) => {
  const { password } = req.body;

  if (typeof password !== "string") {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: "Password is required." });
  }

  try {
    const result = await validatePassword(password);

    if (!result.valid) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        valid: false,
        failedRules: result.failedRules,
      });
    }

    return res.status(HTTP_STATUS_CODES.OK).json({ valid: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : API.UNEXPECTED_ERR;
    console.error(API.ERROR_SIMPLE, message);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: message });
  }
};

/**
 * Update a user's Oracle DB password
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 */
export const updateUserPassword = async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      error: "Username, old password, and new password are required.",
    });
  }

  try {
    await updatePassword(username, oldPassword, newPassword);
    console.log(`${ORACLE.ENTITY_RETURNING} Password updated.`);
    return res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: "Password updated successfully." });
  } catch (err) {
    const code =
      err instanceof ErrorWithCode
        ? err.code
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err instanceof Error ? err.message : API.UNEXPECTED_ERR;

    console.error(API.ERROR_SIMPLE, message);
    return res.status(code).json({ error: message });
  }
};
