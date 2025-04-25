import { ANSI_CODES } from "@/constants";

// unpack constants from @/constants/ansiCodes.ts
// Note: FG.<colour> will update console letter colours
//       BG.<colour> will update the background colour
//       FM.<option> will apply to the terminal
const { FOREGROUND: FG, BACKGROUND: BG, FORMATTING: FM } = ANSI_CODES;

const expressJS = ` ${BG.BLUE}${FG.GREY}| ExpressJS |${FM.RESET} `;
const expressJSErr = `${expressJS}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const API = {
  ERROR_SIMPLE: `${expressJS}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`,
  SERVER_STARTED: `${expressJS}${FG.BLUE}DBUMT Server Started Successfully. Listening on port: ${FM.RESET}`,
  UNEXPECTED_ERR: `${expressJSErr}An unexpected error occurred.${FM.RESET}`,
};

const mongoDb = ` ${BG.GREEN}${FG.GREY}| MongoDB |${FM.RESET} `;
const mongoDbOK = `${mongoDb}${FG.GREEN}`;
const mongoDbWarn = `${mongoDb}${FG.RED}`;
const mongoDbErr = `${mongoDb}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const MONGODB = {
  // Opening Strings
  MONGO_OPEN: ` ${mongoDb}`,
  MONGO_OK: `${mongoDb}${FG.GREEN}`,
  MONGO_WARN: `${mongoDb}${FG.RED}`,
  MONGO_ERR: `${mongoDb}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`,
  // Connection strings
  CONNECTION_SUCCESS: `${mongoDbOK}Connection successful.${FM.RESET}`,
  CONNECTION_OPEN: `${mongoDbOK}Connection open.${FM.RESET}`,
  CONNECTION_DISCONNECTED: `${mongoDbWarn}Disconnected.${FM.RESET}`,
  CONNECTION_RECONNECT: `${mongoDbOK}Reconnected.${FM.RESET}`,
  CONNECTION_DISCONNECTING: `${mongoDb}${FG.GOLD}Disconnecting...${FM.RESET}`,
  CONNECTION_CLOSED: `${mongoDbWarn}Closed.${FM.RESET}`,
  MISSING_VARS: `${mongoDbErr}One or more of required env vars is undefined.${FM.RESET}`,
  CONNECTION_ERROR: `${mongoDbErr}Connecting to the database hit the following:${FM.RESET}`,
  // Entity strings
  EXISTING_ENTITITY: `${mongoDbWarn}Entity already exists.${FM.RESET}`,
  ENTITY_ADDED: `${mongoDbOK}Entity added.${FM.RESET}`,
  ENTITY_FOUND: `${mongoDbOK}Entity found: ${FM.RESET}`,
  ENTITY_ALL: `${mongoDbOK}Returning all Entities.${FM.RESET}`,
  FIND_ERROR: `${mongoDbWarn}Failed to find entry.${FM.RESET}`,
};

const oracleDB = ` ${BG.CYAN}${FG.GREY}| OracleDB |${FM.RESET} `;
const oracleOK = `${oracleDB}${FG.GREEN}`;
const oracleWarn = `${oracleDB}${FG.RED}`;
const oracleErr = `${oracleDB}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const ORACLE = {
  // Connection strings
  CONNECTION_SUCCESS: `${oracleOK}Connection successful.${FM.RESET}`,
  CONNECTION_FAILED: `${oracleErr}Failed to connect to Oracle DB.${FM.RESET}`,
  // Entity strings
  ENTITY_FOUND: `${oracleOK}Entity found.${FM.RESET}`,
  ENTITY_NOT_FOUND: `${oracleWarn}Entity not found.${FM.RESET}`,
  ENTITY_RETURNING: `${oracleOK}Returning entity data.${FM.RESET}`,
  ENTITY_ERROR: `${oracleErr}Failed to retrieve entity.${FM.RESET}`,
  INVALID_USERNAME: `${oracleWarn}Invalid username parameter.${FM.RESET}`,
};

const passwordUpdate = ` ${BG.GOLD}${FG.GREY}| Password Update |${FM.RESET} `;
const passwordOK = `${passwordUpdate}${FG.GREEN}`;
const passwordWarn = `${passwordUpdate}${FG.RED}`;
const passwordErr = `${passwordUpdate}${FG.RED}${FM.BOLD}[ERROR] ${FM.RESET}${FG.RED}`;
export const PASSWORD_UPDATE = {
  VALIDATION_PASSED: `${passwordOK}Password passed all active validation rules.${FM.RESET}`,
  VALIDATION_FAILED: `${passwordWarn}Password failed one or more validation rules.${FM.RESET}`,
  MISSING_VALIDATOR: `${passwordWarn}No validator implemented for rule:${FM.RESET}`,
  RULES_LOADED: `${passwordOK}Loaded active password rules from MongoDB.${FM.RESET}`,
  VALIDATION_ERROR: `${passwordErr}Error occurred during password validation.${FM.RESET}`,
};
