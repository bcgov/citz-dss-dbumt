import { PasswordReqModel } from "@/modules/password-update/schemas/requirements";
import { ErrorWithCode } from "@/utilities";
import { logs } from "@/middleware";
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
export const addPasswordRequirement = async (
  newReq: typeof PasswordReqModel,
) => {
  // Check if a password requirement already exists with the given name
  const existingReq = await PasswordReqModel.exists({ name: newReq.name });
  if (existingReq) {
    // Throw an error if the entity already exists
    console.warn(MONGODB.EXISTING_ENTITITY);
    throw new ErrorWithCode(
      `Password Requirement with name "${newReq.name}" already exists.`,
    );
  }
  // create a new entry of PasswordReqModel
  const addRequirement = new PasswordReqModel(newReq);
  try {
    // try to add the new PasswordReq to MongoDB
    const result = await addRequirement.save();
    return result;
  } catch (err) {
    // catch any errors and rethrow them to be handled in the controller
    throw new ErrorWithCode(`${err instanceof Error ? err.message : err}`);
  }
};

/**
 * Look for and return a password requirement in MongoDB matching the given string.
 *
 * @param reqName: String to search for in MongoDB
 * @throws ErrorWithCode if an error occurs in the search
 */
export const findPasswordRequirementByName = async (reqName: string) => {
  try {
    // check if a requirement with the given name exists
    const existingReqID = await PasswordReqModel.exists({ name: reqName });
    if (!existingReqID) {
      console.warn(logs.MONGODB.FIND_ERROR);
      return null;
    }
    const existingReq = await PasswordReqModel.findById(existingReqID);
    return existingReq;
  } catch (err) {
    throw new ErrorWithCode(
      `${logs.MONGODB.FIND_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  }
};

/**
 * Attempt to get and return all password requirements from MongoDB.
 *
 * @returns Array of all password requirements in the PasswordReqModel collection
 * @throws ErrorWithCode if an error occurs during the search
 */
export const getAllPasswordRequirements = async () => {
  try {
    const requirements = await PasswordReqModel.find({});
    return requirements;
  } catch (err) {
    throw new ErrorWithCode(
      `${logs.MONGODB.FIND_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  }
};

/**
 * Given a password requirement name from URL parameters and a new password requirement object,
 * update the existing password requirement in MongoDB.
 *
 * @param newReq: Full password requirement object to update the existing one with.
 * @returns updatedReq: The updated password requirement object from MongoDB
 * @throws ErrorWithCode if the requirement name is missing, or if an error occurs during the update
 */
export const updatePasswordRequirement = async (newReq: typeof PasswordReqModel) => {
  // TODO: Add user validation
  try {
    if (!newReq.name) {
      throw new ErrorWithCode("Requirement name is required for update.");
    }
    // check if a requirement with the given name exists
    const existingReq = await findPasswordRequirementByName(newReq.name);
    if (!existingReq) {
      console.warn(logs.MONGODB.FIND_ERROR);
      return null;
    }

    // update the existing requirement with the new data
    const updatedReq = await PasswordReqModel.findByIdAndUpdate(
      existingReq._id,
      newReq,
      {
        new: true, //retun the new requirement after update
        runValidators: true, // ensure all required fields are met
        lean: true, // return a plain JavaScript object instead of a Mongoose document
      },
    );
    return updatedReq;
  } catch (err) {
    throw new ErrorWithCode(
      `${logs.MONGODB.UPDATE_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  }
}
