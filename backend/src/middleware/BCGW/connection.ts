import oracledb from "oracledb";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

interface EnvironmentConfig {
  name: string;
  connectString: string;
  user: string;
  password: string;
}

let clientInitialized = false;

/**
 * @summary Connect to BCGW with provided credentials
 *
 * @param connectString - Environment service name
 * @param user - Environment username
 * @param password - Environment password
 * @returns Oracle connection object
 */
export const getOracleConnection = async (env: EnvironmentConfig) => {
  const { name, connectString, user, password } = env;

  if (!connectString || !user || !password) {
    console.log(logs.ORACLE.MISSING_VARS);
    throw new ErrorWithCode(
      "Oracle environment variables are not fully defined.",
    );
  }

  if (!clientInitialized) {
    if (process.env.ORACLE_CLIENT_LOCAL_PATH) {
      try {
        oracledb.initOracleClient({
          libDir: process.env.ORACLE_CLIENT_LOCAL_PATH,
        });
        console.log("Thick mode initialized");
      } catch (err) {
        console.warn(
          "Failed to initialize Oracle Thick mode, falling back to Thin mode.",
          err,
        );
      }
    } else {
      console.log("ORACLE_CLIENT_LOCAL_PATH not set — using Thin mode.");
    }

    clientInitialized = true;
  }

  try {
    console.log(`${logs.ORACLE.ENV_CHECK_START} ${name}`);

    const connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectString,
    });

    console.log(`${logs.ORACLE.CONNECTION_SUCCESS} ${name}`);
    return connection;
  } catch (err) {
    const msg = `${logs.ORACLE.CONNECTION_ERROR} Failed to connect to ${name}: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    throw new ErrorWithCode(msg);
  }
};
