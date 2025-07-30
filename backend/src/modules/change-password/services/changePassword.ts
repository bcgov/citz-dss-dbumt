import oracledb from "oracledb";
import { validatePassword } from "./validatePassword";
import { getOracleConnection } from "../../../middleware/BCGW/connection"; // Centralized connection util

/**
 * Environment connect strings
 */
const CONNECT_STRINGS: Record<string, string | undefined> = {
  DEV: process.env.BCGW_DEV_STRING,
  TEST: process.env.BCGW_TEST_STRING,
  PROD: process.env.BCGW_PROD_STRING,
};

/**
 * Attempt to change an Oracle user password in a given environment.
 *
 * @param oracleId - Target Oracle user ID
 * @param currentPassword - Current password (used for connection auth)
 * @param newPassword - Desired new password
 * @param targetEnv - Target environment (DEV / TEST / PROD)
 */
export const changeOraclePassword = async (
  oracleId: string,
  currentPassword: string,
  newPassword: string,
  targetEnv: string,
): Promise<{ success: boolean; reason?: string }> => {
  const upperOracleId = oracleId.toUpperCase();
  const upperEnv = targetEnv.toUpperCase();

  // Validate environment
  const connectString = CONNECT_STRINGS[upperEnv];
  if (!connectString) {
    return { success: false, reason: `Invalid environment: ${upperEnv}` };
  }

  // Validate password complexity
  const validation = validatePassword(newPassword);
  const allValid = Object.values(validation).every(Boolean);
  if (!allValid) {
    return {
      success: false,
      reason: "Password does not meet complexity requirements",
    };
  }

  let connection: oracledb.Connection | null = null;

  try {
    console.log(
      `Attempting Oracle connection as ${upperOracleId} to ${upperEnv}`,
    );

    // Establish connection as the user
    connection = await getOracleConnection({
      name: "Password Change",
      connectString,
      user: upperOracleId,
      password: currentPassword,
    });

    console.log(`Connected to Oracle as ${upperOracleId}`);

    // Change password
    await connection.execute(
      `ALTER USER ${upperOracleId} IDENTIFIED BY "${newPassword}"`,
    );

    console.log(`Password change successful for ${upperOracleId}`);
    return { success: true };
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`password change error ${oracleId}: ${reason}`);
    return { success: false, reason };
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log(`Oracle disconnected for ${upperOracleId}`);
      } catch (closeErr) {
        console.warn(
          `Failed to close Oracle connection for ${upperOracleId}: ${closeErr}`,
        );
      }
    }
  }
};
