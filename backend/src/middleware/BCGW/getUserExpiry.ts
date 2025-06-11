import oracledb from "oracledb";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

/**
 * @summary Retrieve password expiry date for an oracle user
 *
 * @param connection - Oracle DB connection
 * @param username - Oracle DB name to query
 * @returns Expiry date or null if user not found
 */
export const getOracleUserExpiry = async (
  connection: oracledb.Connection,
  username: string,
): Promise<Date | null | undefined> => {
  try {
    const result = await connection.execute<{ EXPIRY_DATE: Date | null }>(
      `SELECT EXPIRY_DATE FROM DBA_USERS WHERE USERNAME = :username`,
      [username],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    if (!result.rows || result.rows.length === 0) {
      console.warn(`${logs.ORACLE.EXPIRY_NOT_FOUND} ${username}`);
      return undefined; // user not found
    }

    const expiry = result.rows[0].EXPIRY_DATE;

    console.log(`${logs.ORACLE.EXPIRY_FOUND} ${username} → ${expiry}`);
    return expiry; // user found (expiry may still be null)
  } catch (err) {
    console.warn(
      `[Oracle] Query error for ${username}: ${
        err instanceof Error ? err.message : err
      }`,
    );
    throw new ErrorWithCode(`Failed to query user info for ${username}`);
  }
};
