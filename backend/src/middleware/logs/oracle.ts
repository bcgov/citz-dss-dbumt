import { ANSI_CODES } from "@/constants";

// unpack constants from @/constants/ansiCodes.ts
// Note: FG.<colour> will update console letter colours
//       BG.<colour> will update the background colour
//       FM.<option> will apply to the terminal
const { FOREGROUND: FG, BACKGROUND: BG, FORMATTING: FM } = ANSI_CODES;

const oracle = ` ${BG.BLUE}${FG.GREY}| Oracle |${FM.RESET} `;
const oracleOK = `${oracle}${FG.CYAN}`;
const oracleWarn = `${oracle}${FG.GOLD}`;
const oracleErr = `${oracle}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const ORACLE = {
  // Connection/Environment strings
  CONNECTION_SUCCESS: `${oracleOK}Connection established.${FM.RESET}`,
  CONNECTION_ERROR: `${oracleErr}Failed to connect to database.${FM.RESET}`,
  MISSING_VARS: `${oracleErr}One or more Oracle env vars are undefined.${FM.RESET}`,
  DISCONNECTED: `${oracleWarn}Disconnected from Oracle.${FM.RESET}`,
  // Entity strings
  ENTITY_FOUND: `${oracleOK}User exists in this environment.${FM.RESET}`,
  ENTITY_NOT_FOUND: `${oracleWarn}User not found in this environment.${FM.RESET}`,
  ENTITY_ERROR: `${oracleErr}Error while querying user data.${FM.RESET}`,
  // User environment strings
  ENV_CHECK_START: `${oracle}Checking environments for user...${FM.RESET}`,
  ENV_CHECK_SUCCESS: `${oracleOK}User found in one or more environments.${FM.RESET}`,
  ENV_CHECK_FAIL: `${oracleWarn}User not found in any environment.${FM.RESET}`,
  // Password strings
  PASSWORD_EXPIRY_FOUND: `${oracleOK}Password expiration data retrieved.${FM.RESET}`,
  PASSWORD_EXPIRY_MISSING: `${oracleWarn}No password expiration data found.${FM.RESET}`,
  // Input strings
  INVALID_SERVICE_NAME: `${oracleErr}Invalid service name provided to connector.${FM.RESET}`,
};
