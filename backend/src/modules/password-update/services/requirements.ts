import { PasswordReqModel } from "@/modules/password-update/schemas/requirements"
import { logs } from "@/utilities";

const { MONGODB } = logs;

/**
 * Adds a new password requirement to the MongoDB PasswordReqModel
 *
 * @param newReq: Object holding informaion on the new password requirement
 *                Should hold all required fields from PasswordReqModel
 */
export const addPasswordRequirement = async (newReq: typeof PasswordReqModel) => {
  const existingReq = await PasswordReqModel.exists({ name: newReq.name });
  if (existingReq) {
    throw new Error(`${MONGODB.EXISTING_ENTITITY}\n${existingReq}`)
  }
}
