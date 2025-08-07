import { getOracleConnection } from "@/middleware/BCGW/connection";
import { ErrorWithCode } from "@/utilities";
import { logs } from "@/middleware";
import {EnvironmentConfig} from "@/config/oracleEnvironments";
import oracledb from "oracledb";

interface QueriesResult {
  environment: string;
  queryResult: QueryResult[];
}
interface QueryResult {
  query: string;
  data: any[];
}

/**
 * @summary Builds the SQL query string that retrieves the account status, expiry date, and default tablespace for a given Oracle DB username
 * 
 * @returns the SQL query string for account status
 */
export const buildAccountStatusQuery = (): string =>
  `SELECT USERNAME, ACCOUNT_STATUS, NVL(TO_CHAR(expiry_date,'DD-MM-YYYY'),'ADMIN or SERVICE_ID') AS EXPIRY_DATE, DEFAULT_TABLESPACE FROM DBA_USERS WHERE USERNAME = :username`;

/**
 * @summary Builds the SQL query string that retrieves the roles granted to a given Oracle DB username
 * 
 * @returns the SQL query string for roles
 */
export const buildRolesQuery = (): string =>
  `SELECT GRANTEE, GRANTED_ROLE FROM DBA_ROLE_PRIVS WHERE GRANTEE = :username`;

/**
 * @summary Builds the SQL query string that retrieves system privileges granted to a given Oracle DB username
 * 
 * @returns the SQL query string for system privileges
 */
export const buildSystemPrivilegesQuery = (): string =>
  `SELECT GRANTEE, PRIVILEGE FROM DBA_SYS_PRIVS WHERE GRANTEE = :username`;

/**
 * @summary Builds the SQL query string based on the query name
 *
 * @param queryName - Query name to build (e.g., "accountStatus", "roles", "systemPrivileges")
 * @returns the SQL query string for the specified query name, or null if not found
 */
export const buildQuery = (queryName: string): string | null => {
  switch (queryName) {
    case "accountStatus":
      return buildAccountStatusQuery();
    case "roles":
      return buildRolesQuery();
    case "systemPrivileges":
      return buildSystemPrivilegesQuery();
    default:
      return null;
  }
};


/**
 * @summary Gets information about an Oracle user across multiple environments
 *
 * @param username - Oracle DB username to verify
 * @param environments - List of Oracle environments to check
 * @param queries - List of queries to run against each environment
 * @returns Query results for the user in requested environments
 * @throws ErrorWithCode if no environments are configured or connection fails
 */
export const getQueryResults = async (
  username: string,
  environments: EnvironmentConfig[],
  queries: string[]
): Promise<{ results: QueriesResult[], message: string }> => {

  if (!username) {
    throw new ErrorWithCode("Missing username");
  }
  if (environments.length === 0) {
    throw new ErrorWithCode("No environments provided.");
  }
  if (queries.length === 0) {
    throw new ErrorWithCode("No queries provided.");
  }

  const results: QueriesResult[] = [];
  const failedEnvs: string[] = [];

  for (const env of environments) {
    let connection;
    const queryResult: QueryResult[] = [];

    try {
      connection = await getOracleConnection(env);

      for (const query of queries) {
        const sql = buildQuery(query);
        if (!sql) {
          console.warn(`${logs.API.ERROR_SIMPLE} failed to build query ${query} on ${env.name}: not defined`);
          continue;
        }

        const result = await connection.execute(sql, [username], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result === undefined) {
          console.warn(`${logs.ORACLE.ENTITY_NOT_FOUND} ${username} in ${env.name}`);
        } else {
          queryResult.push({
            query,
            data: result.rows || [],
          });
        }
      }

      if (queryResult.length > 0) {
        results.push({
          environment: env.name,
          queryResult,
        });
      }

    } catch (err) {
      failedEnvs.push(env.name);
      console.warn(`${logs.ORACLE.ENTITY_ERROR} failed to query ${env.name}: ${err instanceof Error ? err.message : err}`);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeErr) {
          console.warn(`Failed to close connection for ${env.name}: ${closeErr}`);
        }
      }
    }
  }

  if (results.length === 0) {
    const allFailed = failedEnvs.length === environments.length;
    const message = allFailed
      ? "Internal error: Could not connect to any environments"
      : "No data found for user in any environment";

    const log = allFailed
      ? logs.ORACLE.ENV_CHECK_FAIL
      : logs.ORACLE.ENTITY_NOT_FOUND;
    console.error(log, message);
    return { results, message };
  }

  return { results, message: "Data extracted successfully from one or more environments" };
};





