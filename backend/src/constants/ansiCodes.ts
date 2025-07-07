export const ANSI_CODES = {
  FOREGROUND: {
    // Changes colour of text
    GREY: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    GOLD: "\x1b[33m",
    BLUE: "\x1b[34m",
    PURPLE: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    BARK: "\x1b[48;2;49;45;42m",
  },
  BACKGROUND: {
    // Changes colour behind text
    GREY: "\x1b[40m",
    RED: "\x1b[41m",
    GREEN: "\x1b[42m",
    GOLD: "\x1b[43m",
    BLUE: "\x1b[44m",
    PURPLE: "\x1b[45m",
    CYAN: "\x1b[46m",
    WHITE: "\x1b[47m",
    BARK: "\x1b[48;2;49;45;42m",
  },
  FORMATTING: {
    RESET: "\x1b[0m", // sets the console colours to normal
    DIM: "\x1b[2m", // Makes colours muted
    UNDERSCORE: "\x1b[4m", // Adds underscore
    REVERSE: "\x1b[7m", // Swaps foreground and background colouring
    ITALIC: "\x1b[3m", // Prints text with Italic formatting
    STRIKETHROUGH: "\x1b[9m", // Strikethrough text
    BOLD: "\x1b[1m", // Increases text weight
  },
};
