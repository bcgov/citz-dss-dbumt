import { ANSI_CODES } from "@/constants";

// unpack constants from @/constants/ansiCodes.ts
// Note: FG.<colour> will update console letter colours
//       BG.<colour> will update the background colour
//       FM.<option> will apply to the terminal
const { FOREGROUND: FG, BACKGROUND: BG, FORMATTING: FM } = ANSI_CODES;

const expressJS = ` ${BG.CYAN}${FG.GREY}| ExpressJS |${FM.RESET} `;
export const API = {
  SERVER_STARTED: `${expressJS}${FG.CYAN}DBUMT Server Started Successfully. Listening on port: ${FM.RESET}`,
};

const mongoDb = ` ${BG.LIME}${FG.GREY}| MongoDB |${FM.RESET} `
export const MONGODB = {
  CONNECTION_SUCCESS: `${mongoDb}${FG.LIME}Connection successful.${FM.RESET}`,
  CONNECTION_OPEN: `${mongoDb}${FG.LIME}Connection open.${FM.RESET}`,
  CONNECTION_DISCONNECTED: `${mongoDb}${FG.RED}Disconnected.${FM.RESET}`,
  CONNECTION_RECONNECT: `${mongoDb}${FG.GREEN}Reconnected.${FM.RESET}`,
  CONNECTION_DISCONNECTING: `${mongoDb}${FG.YELLOW}Disconnecting...${FM.RESET}`,
  CONNECTION_CLOSED: `${mongoDb}${FG.RED}Closed.${FM.RESET}`,
  MISSING_VARS: `${mongoDb}${FG.PINK}[ERROR] ${FM.RESET}${FG.RED}One or more of required env vars is undefined.${FM.RESET}`,
  CONNECTION_ERROR: `${mongoDb}${FG.PINK}[ERROR] ${FM.RESET}${FG.RED}Connecting to the database:${FM.RESET}`,
};
