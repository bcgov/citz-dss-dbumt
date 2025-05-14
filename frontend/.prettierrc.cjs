/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'lf',
  arrowParens: 'always',
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/global.css"
};

module.exports = config;
