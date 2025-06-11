import { getOracleUserExpiry } from "@/middleware/BCGW/getUserExpiry";
import { Connection } from "oracledb";

/**
 * Check if user exists in dev/test/prod services
 *
 * @param connection - Oracle DB connection
 * @param username - Oracle DB username to verify
 * @returns Whether user exists in provided environment
 */
export const getUserExpiryInEnv = async (
  connection: Connection,
  username: string,
): Promise<Date | null> => {
  return (await getOracleUserExpiry(connection, username)) ?? null;
};