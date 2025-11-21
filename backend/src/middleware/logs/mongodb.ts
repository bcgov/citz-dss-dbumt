import { ANSI_CODES } from "@/constants";

// unpack constants from @/constants/ansiCodes.ts
// Note: FG.<colour> will update console letter colours
//       BG.<colour> will update the background colour
//       FM.<option> will apply to the terminal
const { FOREGROUND: FG, BACKGROUND: BG, FORMATTING: FM } = ANSI_CODES;

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
  FIND_ERROR: `${mongoDbErr}Failed to find entry.${FM.RESET}`,
  ENTITY_UPDATED: `${mongoDbOK}Entity updated.${FM.RESET}`,
  UPDATE_ERROR: `${mongoDbErr}Failed to update entry.${FM.RESET}`,
  ADD_ERROR: `${mongoDbErr}Failed to add entry.${FM.RESET}`,
};
