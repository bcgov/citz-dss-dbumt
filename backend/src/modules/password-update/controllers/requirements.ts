import { Request, Response } from "express";
import { addPasswordRequirement } from "@/modules/password-update/services"
import { passwordReqInterface } from "@/modules/password-update/schemas"

/**
 * Handle request to add new password requirement to mongoDB
 */
export const addRequirement = async (req: Request, res: Response) => {
  //const { name, description, active, numCharReq } = req;
  console.log(req);
}
