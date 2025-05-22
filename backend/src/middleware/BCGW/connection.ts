import oracledb from "oracledb";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

/**
 * @summary Connect to BCGW with provided credentials
 *
 * @param serviceName - Environment service name 
 * @param serviceUSer - Environment username
 * @param servicePassword - Environment password
 * @returns Oracle connection object
 */

let clientInitialized = false;

export const getOracleConnection = async (
  serviceName: string,
  serviceUser: string,
  servicePassword: string,
) => {
  if (!serviceName || !serviceUser || !servicePassword) {
    console.log(logs.ORACLE.MISSING_VARS);
    throw new ErrorWithCode(
      "Oracle environment variables are not fully defined.",
    );
  }

  if (!clientInitialized) {
    try {
      oracledb.initOracleClient({
        libDir: process.env.ORACLE_CLIENT_LIB_PATH,
      });
      clientInitialized = true;
    } catch (err) {
      console.warn(
        "Could not initialize Oracle Thick mode. Falling back to Thin mode. Details:",
        err,
      );
    }
  }

  try {
    console.log(`${logs.ORACLE.ENV_CHECK_START} ${serviceName}`);

    const connection = await oracledb.getConnection({
      user: serviceUser,
      password: servicePassword,
      connectString: serviceName,
    });

    console.log(`${logs.ORACLE.CONNECTION_SUCCESS} ${serviceName}`);
    return connection;
  } catch (err) {
    const msg = `${logs.ORACLE.CONNECTION_ERROR} Failed to connect to ${serviceName}: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    throw new ErrorWithCode(msg);
  }
};
