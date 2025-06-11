import { getOracleConnection } from "@/middleware/BCGW/connection";
import { getOracleUserExpiry } from "@/middleware/BCGW/getUserExpiry";

// configuration for a specific oracle environment
interface EnvironmentConfig {
  name: string;
  connectString: string;
  user: string;
  password: string;
}

/**
 * Check if user exists in dev/test/prod services
 *
 * @param username - Oracle DB username to verify
 * @returns Whether user exists in provided environment
 */
export const getUserExpiryInEnv = async (
  env: EnvironmentConfig,
  username: string,
): Promise<Date | null> => {
  const connection = await getOracleConnection(env);
  try {
    const expiry = await getOracleUserExpiry(connection, username);
    return expiry ?? null;
  } finally {
    await connection.close();
  }
};
