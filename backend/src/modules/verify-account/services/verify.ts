import oracledb from "oracledb";
import { getOracleConnection } from "@/middleware/BCGW/connection";
import { ErrorWithCode } from "@/utilities";
import { logs } from "@/middleware";

const { ORACLE } = logs;

/**
 * Configuration for a specific oracle environment
 */
interface EnvironmentConfig {
  name: string;
  connectString: string;
  user: string;
  password: string;
}

// oracle service names to check
// TODO:
// for production, add prod environment to the list below
const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    name: "DEV",
    connectString: process.env.BCGW_DEV_STRING,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
  },
  {
    name: "TEST",
    connectString: process.env.BCGW_TEST_STRING,
    user: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
  },
  {
    name: "PROD",
    connectString: process.env.BCGW_PROD_STRING,
    user: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
  },
].filter(
  (env): env is EnvironmentConfig =>
    typeof env.connectString === "string" &&
    typeof env.user === "string" &&
    typeof env.password === "string",
);

if (ENVIRONMENTS.length === 0) {
  throw new ErrorWithCode(
    "No Oracle BCGW environments are defined. Check .env file.",
  );
}

interface OracleUserRow {
  EXPIRY_DATE: Date | null;
}

interface OracleUserResult {
  environment: string;
  pswd_expires: Date | null;
}

/**
 * Check if user exists in dev/test/prod services
 *
 * @param username - Oracle DB username to verify
 * @returns List of environments and password expiry dates where the user exists
 */
export const checkOracleIdAcrossEnvs = async (
  username: string,
): Promise<OracleUserResult[]> => {
  const results: OracleUserResult[] = [];
  const upperUsername = username.toUpperCase();

  for (const { name, connectString, user, password } of ENVIRONMENTS) {
    let connection;
    try {
      console.log(`${ORACLE.ENV_CHECK_START} ${name}`);
      connection = await getOracleConnection(connectString, user, password);

      const result = await connection.execute<OracleUserRow>(
        `SELECT EXPIRY_DATE FROM DBA_USERS WHERE USERNAME = :username`,
        [upperUsername],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );

      if (result.rows && result.rows.length > 0) {
        const { EXPIRY_DATE } = result.rows[0];
        results.push({ environment: name, pswd_expires: EXPIRY_DATE });
        console.log(`${ORACLE.ENTITY_FOUND} ${upperUsername} in ${name}`);
      } else {
        console.warn(`${ORACLE.ENTITY_NOT_FOUND} ${upperUsername} in ${name}`);
      }
    } catch (err) {
      console.warn(
        `${ORACLE.ENTITY_ERROR} Failed to query ${name}: ${
          err instanceof Error ? err.message : err
        }`,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeErr) {
          console.warn(
            `${ORACLE.DISCONNECTED} Error closing connection to ${name}: ${
              closeErr instanceof Error ? closeErr.message : closeErr
            }`,
          );
        }
      }
    }
  }

  if (results.length === 0) {
    console.warn(
      `${ORACLE.ENV_CHECK_FAIL} ${upperUsername} not found in any environment.`,
    );
    throw new ErrorWithCode(
      `${upperUsername} not found in any BCGW environment.`,
    );
  }

  return results;
};
