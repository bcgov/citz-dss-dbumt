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
