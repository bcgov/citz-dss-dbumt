import { Schema, model } from "mongoose";

export interface passwordReqInterface {
  name: string;
  description: string;
  active: boolean;
  numCharReq: number;
}

/**Summary:
 * Create the password requirement schema. Each requirement will get their own entry.
 * Fields:
 *   name: Summary of rule, what will be displayed on password requirement page
 *   description: Clarification of rule, will be displayed as a tip on hover
 *   active: Sets if the rule should be used or not
 *   numCharReq: For basic rules this can be used to set the number of maching characters that are required.
 *     ex. If the rule is "Upper case characters" and there are 2 required this would be set to 2
 * Timestanps: Automatically track when an entry is first created (createdAt) or updated (updatedAt)
 */
const passwordReqSchema = new Schema<passwordReqInterface>(
  {
    name: {
      type: String,
      required: [true, "Must provide a rule name"],
      unique: true,
    },
    description: String,
    active: {
      type: Boolean,
      required: [
        true,
        "Must set rule status (true = active, false = inactive)",
      ],
    },
    numCharReq: Number,
  },
  { timestamps: true },
);

// Create the model in the mongo database, and export it to use elsewhere.
// Note - a mongoose model = a mongodb collection
export const PasswordReqModel = model<passwordReqInterface>(
  "PasswordReqModel",
  passwordReqSchema,
);
