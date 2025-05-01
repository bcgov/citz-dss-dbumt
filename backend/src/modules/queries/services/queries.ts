import oracledb from "oracledb";
import { logs, ErrorWithCode } from "@/utilities";

const { ORACLE } = logs;

interface AccountDetails {
  USERNAME: string;
  CREATED: Date;
  ACCOUNT_STATUS: string;
}

/**
 * Creates an oracle database connection
 *
 * @returns Oracle DB connection
 */
const getOracleConnection = async () => {
  return oracledb.getConnection({
    user: process.env.AQT_USER!,
    password: process.env.AQT_PASSWORD!,
    connectString: process.env.AQT_CONNECT_STRING!,
  });
};

/**
 * Gets the list of privileges assigned to a user
 *
 * @param username - Oracle DB username to query privileges for
 * @throws ErrorWithCode if the database operation fails
 */
export const getAccountPrivilegesService = async (username: string) => {
  let connection: oracledb.Connection | undefined;
  try {
    connection = await getOracleConnection();

    const result = await connection.execute(
      `SELECT PRIVILEGE FROM DBA_SYS_PRIVS WHERE GRANTEE = :username`,
      [username],
    );

    if (!result.rows?.length) {
      console.warn(ORACLE.ENTITY_NOT_FOUND);
      return null;
    }

    console.log(ORACLE.ENTITY_FOUND);
    return result.rows;
  } catch (err) {
    throw new ErrorWithCode(
      `${ORACLE.ENTITY_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  } finally {
    if (connection) await connection.close();
  }
};

/**
 * Gets the account status of a single user
 *
 * @param username - Oracle DB username to check
 * @throws ErrorWithCode if the database operation fails
 */
export const getAccountStatusService = async (username: string) => {
  let connection: oracledb.Connection | undefined;
  try {
    connection = await getOracleConnection();

    const result = await connection.execute(
      `SELECT ACCOUNT_STATUS FROM DBA_USERS WHERE USERNAME = :username`,
      [username],
    );

    if (!result.rows?.length) {
      console.warn(ORACLE.ENTITY_NOT_FOUND);
      return null;
    }

    console.log(ORACLE.ENTITY_FOUND);
    return result.rows[0];
  } catch (err) {
    throw new ErrorWithCode(
      `${ORACLE.ENTITY_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  } finally {
    if (connection) await connection.close();
  }
};

/**
 * Gets account details for a single user
 *
 * @param username - Oracle DB username to query
 * @throws ErrorWithCode if the database operation fails
 */
export const getAccountDetailsService = async (username: string) => {
  let connection: oracledb.Connection | undefined;

  try {
    connection = await getOracleConnection();

    const result = await connection.execute<AccountDetails>(
      `SELECT USERNAME, CREATED, ACCOUNT_STATUS FROM DBA_USERS WHERE USERNAME = :username`,
      [username],
    );

    if (!result.rows?.length) {
      console.warn(ORACLE.ENTITY_NOT_FOUND);
      return null;
    }

    console.log(ORACLE.ENTITY_FOUND);
    return result.rows[0];
  } catch (err) {
    throw new ErrorWithCode(
      `${ORACLE.ENTITY_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  } finally {
    if (connection) await connection.close();
  }
};
