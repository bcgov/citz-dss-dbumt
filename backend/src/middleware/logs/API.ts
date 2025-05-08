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
