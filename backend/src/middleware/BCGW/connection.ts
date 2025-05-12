import oracledb from "oracledb";
import { logs } from "@/middleware";
import { ErrorWithCode } from "@/utilities";

/**
 * @summary Establish a connection to the BCGW with a given service name.
 *
 * @param serviceName - Oracle service name (e.g. IDWDEV.BCGOV, IDWPROD.BCGOV)
 * @returns Oracle connection object
 */

export const getOracleConnection = async (serviceName: string) => {
  const baseConnectString = process.env.SERVICE_CONNECT_STRING;

  if (
    !baseConnectString ||
    !process.env.SERVICE_USER ||
    !process.env.SERVICE_PASSWORD
  ) {
    console.log(logs.ORACLE.MISSING_VARS);
    throw new ErrorWithCode(
      "Oracle environment variables are not fully defined.",
    );
  }

  const fullConnectString = `${baseConnectString}/${serviceName}`;

  try {
    console.log(`${logs.ORACLE.ENV_CHECK_START} ${serviceName}`);

    const connection = await oracledb.getConnection({
      user: process.env.SERVICE_USER,
      password: process.env.SERVICE_PASSWORD,
      connectString: fullConnectString,
    });

    console.log(`${logs.ORACLE.CONNECTION_SUCCESS} ${serviceName}`);
    return connection;
  } catch (err) {
    const msg = `${logs.ORACLE.CONNECTION_ERROR} Failed to connect to ${serviceName}: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    throw new ErrorWithCode(msg);
  }
};
