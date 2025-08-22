import { Connection } from "oracledb";
import { getOracleConnection } from "@/middleware/BCGW/connection";
import { ErrorWithCode } from "@/utilities";
import { logs } from "@/middleware";
import { EnvironmentConfig } from "@/config/oracleEnvironments";
import oracledb from "oracledb";

interface OracleUserResult {
  environment: string;
  pswd_expires: Date | null;
}

/**
 * @summary Check if user exists in DB environments and return their password expiry dates
 *
 * @param username - Oracle DB username to verify
 * @param environments - List of Oracle environments to check
 * @returns Whether user exists in provided environment and their password's expiry date, or an error message
 * @throws ErrorWithCode if no environments are configured or connection fails
 */
export const getUserExpiry = async (
  username: string,
  environments: EnvironmentConfig[],
): Promise<{ results: OracleUserResult[]; message: string }> => {
  if (!username) {
    throw new ErrorWithCode("Missing required parameter: username");
  }
  if (environments.length === 0) {
    throw new ErrorWithCode("No environments provided.");
  }

  const results: OracleUserResult[] = [];
  const failedEnvs: string[] = [];
  for (const env of environments) {
    let connection;
    try {
      connection = await getOracleConnection(env);
      const expiry = await getUserExpiryInEnv(connection, username);
      if (expiry === undefined) {
        console.warn(
          `${logs.ORACLE.ENTITY_NOT_FOUND} ${username} in ${env.name}`,
        );
      } else {
        results.push({ environment: env.name, pswd_expires: expiry });
        console.log(`${logs.ORACLE.ENTITY_FOUND} ${username} in ${env.name}`);
      }
    } catch (err) {
      failedEnvs.push(env.name);
      console.warn(
        `${logs.ORACLE.ENTITY_ERROR} failed to query ${env.name}: ${err instanceof Error ? err.message : err}`,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeErr) {
          console.warn(
            `Failed to close connection for ${env.name}: ${closeErr}`,
          );
        }
      }
    }
  }

  if (results.length === 0) {
    const allFailed = failedEnvs.length === environments.length;
    const message = allFailed
      ? "Internal error: Could not connect to any environments"
      : `User not found in any environment`;

    const log = allFailed
      ? logs.ORACLE.ENV_CHECK_FAIL
      : logs.ORACLE.ENTITY_NOT_FOUND;
    console.error(log, message);
    return { results, message };
  }
  return { results, message: "User found in one or more environments" };
};

/**
 * @summary Check if user exists in specified environment (dev/test/prod) and get their expiry date
 *
 * @param connection - Oracle DB connection
 * @param username - Oracle DB username to verify
 * @returns Whether user exists in provided environment
 */
export const getUserExpiryInEnv = async (
  connection: Connection,
  username: string,
): Promise<Date | null | undefined> => {
  return await getOracleUserExpiryFromDB(connection, username);
};

/**
 * @summary Retrieve password expiry date for an oracle user from a specific Oracle database
 *
 * @param connection - Oracle DB connection
 * @param username - Oracle DB username to query
 * @returns Expiry valid/null expiry date, or undefined if user not found
 */
export const getOracleUserExpiryFromDB = async (
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
