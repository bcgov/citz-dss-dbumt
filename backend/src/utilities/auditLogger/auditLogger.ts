import { AuditLog } from "./models/auditLog";
import { logs } from "@/middleware";
import { LogParams } from "./types";

/**
 * @summary Logs audit information to the database
 *
 * @param param - Log parameters
 */
export const auditLogger = async (param: LogParams): Promise<void> => {
  try {
    const logItem = new AuditLog(param);

    await logItem.save();
    console.log(
      `${logs.MONGODB.ENTITY_ADDED}: ${logItem.actionType} log for ${logItem.oracleID}`,
    );
  } catch (error) {
    console.log(`${logs.MONGODB.ADD_ERROR} ${error}`);
  }
};
