import oracledb from "oracledb";
import { getAllPasswordRequirements } from "./requirements";
import { logs, ErrorWithCode } from "@/utilities";

const { UPDATE_LOGGING, ORACLE } = logs;

export interface PasswordRule {
  name: string;
  numCharReq: number;
}

/**
 * Load all active password rules from MongoDB
 *
 * @returns Array of PasswordRule objects
 * @throws ErrorWithCode if the database query fails
 */
const loadActivePasswordRules = async (): Promise<PasswordRule[]> => {
  try {
    const allRules = await getAllPasswordRequirements();
    console.log(UPDATE_LOGGING.RULES_LOADED);
    return allRules
      .filter((rule) => rule.active)
      .map((rule) => ({
        name: rule.name.toLowerCase(),
        numCharReq: rule.numCharReq || 0,
      }));
  } catch (err) {
    throw new ErrorWithCode(
      `${UPDATE_LOGGING.VALIDATION_ERROR} ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
};

type RuleValidator = (password: string, numCharReq: number) => boolean;

// hardcoded password rules (note: if we want to make this dynamic, we have to add a field to the mongodb schema for an expression or regex)
const validators: Record<string, RuleValidator> = {
  uppercase: (pw, n) => (pw.match(/[A-Z]/g) || []).length >= n,
  lowercase: (pw, n) => (pw.match(/[a-z]/g) || []).length >= n,
  numbers: (pw, n) => (pw.match(/[0-9]/g) || []).length >= n,
  "special characters": (pw, n) =>
    (pw.match(/[^A-Za-z0-9]/g) || []).length >= n,
  "minimum length": (pw, n) => pw.length >= n,
};

interface ValidationResult {
  valid: boolean;
  failedRules: string[];
}

/**
 * Validates password with active password rules
 *
 * @param password - The password string to validate
 * @returns 'valid' boolean, and optional 'failedRules'
 * @throws ErrorWithCode if an error occurs during validation
 */
export const validatePassword = async (
  password: string,
): Promise<ValidationResult> => {
  try {
    const rules = await loadActivePasswordRules();
    const failedRules: string[] = [];

    for (const rule of rules) {
      const validator = validators[rule.name];
      if (!validator) {
        console.warn(`${UPDATE_LOGGING.MISSING_VALIDATOR} ${rule.name}`);
        continue;
      }

      if (!validator(password, rule.numCharReq)) {
        failedRules.push(rule.name);
      }
    }

    if (failedRules.length === 0) {
      console.log(UPDATE_LOGGING.VALIDATION_PASSED);
    } else {
      console.warn(UPDATE_LOGGING.VALIDATION_FAILED);
    }

    return {
      valid: failedRules.length === 0,
      failedRules,
    };
  } catch (err) {
    throw new ErrorWithCode(
      `${UPDATE_LOGGING.VALIDATION_ERROR} ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
};

/**
 * Update an Oracle password by authenticating with the old password
 *
 * @param username - Oracle username
 * @param oldPassword - Current password
 * @param newPassword - New password to set
 * @throws ErrorWithCode if an error occurs
 */
export const updatePassword = async (
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: username,
      password: oldPassword,
      connectString: process.env.AQT_CONNECT_STRING!,
    });

    const userCheck = await connection.execute(
      `SELECT USERNAME FROM ALL_USERS WHERE USERNAME = :username`,
      [username.toUpperCase()],
    );

    if (!userCheck.rows || userCheck.rows.length === 0) {
      console.warn(ORACLE.ENTITY_NOT_FOUND);
      throw new ErrorWithCode("User not found.");
    }

    // basic security to prevent a user from escaping the 'ALTER USER' command
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      throw new ErrorWithCode("Invalid characters in username.");
    }

    await connection.execute(
      `ALTER USER ${username} IDENTIFIED BY "${newPassword}"`,
      [],
      { autoCommit: true },
    );

    console.log(`${ORACLE.ENTITY_RETURNING} Password updated for ${username}.`);
  } catch (err) {
    throw new ErrorWithCode(
      `${ORACLE.ENTITY_ERROR} ${err instanceof Error ? err.message : err}`,
    );
  } finally {
    if (connection) await connection.close();
  }
};
