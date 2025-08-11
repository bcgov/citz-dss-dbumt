import oracledb from "oracledb";
import { validatePassword } from "./validatePassword";
import { getOracleConnection } from "../../../middleware/BCGW/connection"; // Centralized connection util
import { EnvironmentConfig } from "@/config/oracleEnvironments";

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
  targetEnv: EnvironmentConfig,
): Promise<{ success: boolean; reason?: string }> => {
  const upperOracleId = oracleId.toUpperCase();

  // Validate environment
  const connectString = targetEnv.connectString;
  if (!connectString) {
    return { success: false, reason: `Invalid environment: ${targetEnv.name}` };
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
      `Attempting Oracle connection as ${upperOracleId} to ${targetEnv.name}...`,
    );

    // Establish connection as the user
    connection = await getOracleConnection({
      name: "Password Change",
      connectString,
      user: upperOracleId,
      password: currentPassword,
    });

    console.log(`Connected to Oracle as ${upperOracleId}`);

    // Validate Oracle ID format to only contain uppercase letters, numbers, and underscores.
    // Since we cannot use variable binding in the ALTER USER statement, this is an extra safety check to prevent SQL injection
    const isValidOracleId = /^[A-Z0-9_]+$/.test(upperOracleId);
    if (!isValidOracleId) {
      return { success: false, reason: "Invalid Oracle ID format" };
    }

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
