import { ANSI_CODES } from "@/constants";

// unpack constants from @/constants/ansiCodes.ts
// Note: FG.<colour> will update console letter colours
//       BG.<colour> will update the background colour
//       FM.<option> will apply to the terminal
const { FOREGROUND: FG, BACKGROUND: BG, FORMATTING: FM } = ANSI_CODES;

const oracle = ` ${BG.BARK}${FG.WHITE}| Oracle |${FM.RESET} `;
const oracleOK = `${oracle}${FG.CYAN}`;
const oracleWarn = `${oracle}${FG.GOLD}`;
const oracleErr = `${oracle}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const ORACLE = {
  // Connection/Environment strings
  CONNECTION_SUCCESS: `${oracleOK}Connection established.${FM.RESET}`,
  CONNECTION_ERROR: `${oracleErr}Failed to connect to database.${FM.RESET}`,
  MISSING_VARS: `${oracleErr}One or more Oracle env vars are undefined.${FM.RESET}`,
  DISCONNECTED: `${oracleWarn}Disconnected from Oracle.${FM.RESET}`,
  INVALID_ENV: `${oracleErr}One or more Oracle environemnts are not defined:${FM.RESET}`,

  // Entity strings
  ENTITY_FOUND: `${oracleOK}User exists in this environment.${FM.RESET}`,
  ENTITY_NOT_FOUND: `${oracleWarn}User not found in this environment.${FM.RESET}`,
  ENTITY_ERROR: `${oracleErr}Error while querying user data.${FM.RESET}`,
  // User environment strings
  ENV_CHECK_START: `${oracle}Checking environments for user...${FM.RESET}`,
  ENV_CHECK_FAIL: `${oracleWarn}User not found in any environment.${FM.RESET}`,
  // Password expiry retrieval
  EXPIRY_FOUND: `${oracleOK}Password expiry retrieved for user.${FM.RESET}`,
  EXPIRY_NOT_FOUND: `${oracleWarn}No expiry data found for user.${FM.RESET}`,
};
