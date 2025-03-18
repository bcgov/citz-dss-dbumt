import { PasswordReqModel } from "@/modules/password-update/schemas/requirements"
import { logs, ErrorWithCode } from "@/utilities";
import { Error } from "mongoose";


const { MONGODB } = logs;

/**
 * Adds a new password requirement to the MongoDB PasswordReqModel
 *
 * @param newReq: Object holding informaion on the new password requirement
 *                Should hold all required fields from PasswordReqModel
 * @throws ErrorWithCode: If the newReq already exists in the collection, or if
 *                it is mising any required fields as defined in PasswordReqModel
 */
export const addPasswordRequirement = async (newReq: typeof PasswordReqModel) => {
  // Check if a password requirement already exists with the given name
  const existingReq = await PasswordReqModel.exists({ name: newReq.name });
  if (existingReq) {
    // Throw an error if the entity already exists
    throw new ErrorWithCode(`${MONGODB.EXISTING_ENTITITY} Password Requirement with name "${newReq.name}" already exists.`);
  }
  // create a new entry of PasswordReqModel
  const addRequirement = new PasswordReqModel(newReq);
  try {
    // try to add the new PasswordReq to MongoDB
    const result = await addRequirement.save();
    return result;

  } catch (err) {
    // catch any errors and rethrow them to be handled in the controller
    throw new ErrorWithCode(`${err instanceof Error ? err.message : err}`)
  }
}
