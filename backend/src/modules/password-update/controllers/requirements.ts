import { Request, Response } from "express";
import {
  addPasswordRequirement,
  findPasswordRequirementByName,
  getAllPasswordRequirements,
  updatePasswordRequirement,
} from "@/modules/password-update/services";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";

/**
 * Handle request to add new password requirement to mongoDB
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: Status and reqult of the new password requirement
 * @throws res: If an error occurs, will send back an error message
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
    console.error(logs.API.ERROR_SIMPLE, err_message);
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
 * @returns res: Status and result of the found password requirement
 */
export const findReqByName = async (req: Request, res: Response) => {
  // TODO: Add user validation
  const foundReq = await findPasswordRequirementByName(req.params.name);
  if (!foundReq) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .send("Requirement not found");
  }
  console.log(logs.MONGODB.ENTITY_FOUND, req.params.name);
  return res.status(HTTP_STATUS_CODES.OK).send(foundReq);
};

/**
 * Return all password requirements from MongoDB
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns Status and result of password requirement search
 */
export const getAllReq = async (req: Request, res: Response) => {
  // TODO: Add user validation
  const allReq = await getAllPasswordRequirements();
  if (!allReq) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .send("No Requirements found");
  }
  console.log(logs.MONGODB.ENTITY_ALL);
  return res.status(HTTP_STATUS_CODES.OK).send(allReq);
};

/**
 * Update an existing password requirement in MongoDB
 *
 * @param req: Request  Incoming request from client - should contain full password requirement object
 * @param res: Response Outgoing information to client
 * @returns res: Status and result of the updated password requirement
 */
export const updateRequirement = async (req: Request, res: Response) => {
  // get the name of the requirement to update from the URL parameter
  const requirementName = req.params.name;
  // check if the name from URL matches the name in the request body
  // if they do not match, return a 400 error
  if (requirementName !== req.body.name) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("Requirement name in URL does not match body");
  }

  // try to update the password requirement
  const updatedReq = await updatePasswordRequirement(req.body);
  if (!updatedReq) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .send("Requirement not found or could not be updated");
  }
  console.log(logs.MONGODB.ENTITY_UPDATED, req.params.name);
  return res.status(HTTP_STATUS_CODES.OK).send(updatedReq);

}
