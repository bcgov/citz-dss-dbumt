import { Request, Response } from "express";
import { changeOraclePassword } from "../services";
import { HTTP_STATUS_CODES } from "@/constants";

/**
 * Handle request to change a user's Oracle password
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: Status and result of the password change operation
 * @throws res: If an error occurs, will send back an error message
 */
export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { oracleId, currentPassword, newPassword, targetEnv } = req.body;

    if (!oracleId || !currentPassword || !newPassword || !targetEnv) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .send("Missing required parameters");
    }

    const result = await changeOraclePassword(
      oracleId,
      currentPassword,
      newPassword,
      targetEnv,
    );

    if (result.success) {
      return res
        .status(HTTP_STATUS_CODES.OK)
        .send("Password changed successfully");
    } else {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: "Failed to change password", reason: result.reason });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(`Server error: ${message}`);
  }
};
