import { Request, Response } from "express";
import {
  addPasswordRequirement,
  findPasswordRequirementByName,
  getAllPasswordRequirements,
} from "@/modules/password-update/services";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/utilities";

/**
 * Handle request to add new password requirement to mongoDB
 */
export const addRequirement = async (req: Request, res: Response) => {
  // TODO: Add user validation
  let newReq;
  try {
    newReq = await addPasswordRequirement(req.body);
  } catch (err) {
    // if we catch an error create a message and send back
    let err_message = `${logs.API.UNEXPECTED_ERR}`;
    // if we hit an Error we can use the message provided
    if (err instanceof Error) err_message = err.message;
    console.error(err_message);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(err_message);
  }
  console.log(logs.MONGODB.ENTITY_ADDED);
  return res.status(HTTP_STATUS_CODES.OK).send(newReq);
};

/**
 * Try to find and return a password requirement matching the given name
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With information from MongoDB
 */
export const findReqByName = async (req: Request, res: Response) => {
  // TODO: Add user validation
  const foundReq = await findPasswordRequirementByName(req.params.name);
  if (!foundReq) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .send("Requirement not found");
  }
  return res.status(HTTP_STATUS_CODES.OK).send(foundReq);
};

export const getAllReq = async (req: Request, res: Response) => {
  // TODO: Add user validation
  const allReq = await getAllPasswordRequirements();
  if (!allReq) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .send("No Requirements found");
  }
  return res.status(HTTP_STATUS_CODES.OK).send(allReq);
};
