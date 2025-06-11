import { Request, Response } from "express";
import { getUserExpiryInEnv } from "../services/verify";
import { getOracleConnection } from "@/middleware/BCGW/connection";
import { HTTP_STATUS_CODES } from "@/constants";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

// oracle environments to check
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

// configuration for a specific oracle environment
interface EnvironmentConfig {
  name: string;
  connectString: string;
  user: string;
  password: string;
}

interface OracleUserResult {
  environment: string;
  pswd_expires: Date | null;
}

/**
 * Handle request to check if an user exists in multiple environments,
 * and return expiry dates.
 *
 * @param req: Request  Incoming request from client
 * @param res: Response Outgoing information to client
 * @returns res: With user ID verification
 */
export const verifyOracleId = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send("Missing required parameter: username");
  }

  const upperUsername = username.toUpperCase();
  const results: OracleUserResult[] = [];
  const failedEnvs: string[] = [];

  for (const env of ENVIRONMENTS) {
    let connection;
    try {
      connection = await getOracleConnection(env);
      const expiry = await getUserExpiryInEnv(connection, upperUsername);
      if (expiry === undefined) {
        console.warn(
          `${logs.ORACLE.ENTITY_NOT_FOUND} ${upperUsername} in ${env.name}`,
        );
      } else {
        results.push({ environment: env.name, pswd_expires: expiry });
        console.log(
          `${logs.ORACLE.ENTITY_FOUND} ${upperUsername} in ${env.name}`,
        );
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
    const allFailed = failedEnvs.length === ENVIRONMENTS.length;
    const message = allFailed
      ? "Internal error: Could not connect to any environments"
      : `User not found in any environment`;

    const log = allFailed
      ? logs.ORACLE.ENV_CHECK_FAIL
      : logs.ORACLE.ENTITY_NOT_FOUND;
    console.error(log, message);
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).send(message);
  }

  return res.status(HTTP_STATUS_CODES.OK).send(results);
};
