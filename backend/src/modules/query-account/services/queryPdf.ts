import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";
import { escapeHtml } from "../../../utilities/html";
import { PdfQueryResults } from "../types/pdfQueryResults";

let browser: Browser | null = null;

/**
 * @summary Lazily initializes and returns a reusable Puppeteer browser instance.
 *
 * Ensures a single browser is reused across PDF generations
 * Uses bundled Chromium by default (local development).
 * Uses system Chromium if PUPPETEER_EXECUTABLE_PATH is provided (container).
 * @returns {Promise<Browser>} Active Puppeteer browser instance
 */
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

    browser = await puppeteer.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}), //Local dev doesn't need a path to Chromium
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",

        "--disable-crash-reporter",
        "--disable-crashpad",
        "--no-zygote",
        "--single-process",

        // force writable dir
        "--user-data-dir=/tmp/chrome-data",
      ],
    });
  }
  return browser;
}

/**
 * @summary Builds an HTML document string representing the account query results.
 *
 * Transforms the normalized PDF query result structure into a styled
 * HTML layout that mirrors the UI representation of tables and sections.
 * Dynamic values are HTML-escaped
 * This HTML is later rendered by Puppeteer into a PDF document.
 *
 * @param {PdfQueryResults[]} results - Account query results formatted for PDF rendering
 * @returns {string} Complete HTML document string
 */
function buildHtml(results: PdfQueryResults[]) {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }

        .card {
          background: white;
          margin-bottom: 30px;
          border: 1px solid #ddd;
        }

        .header {
          background: #2f5597;
          color: white;
          padding: 12px 16px;
          font-size: 18px;
          font-weight: bold;
        }

        .section {
          padding: 16px;
        }

        h3 {
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        th, td {
          border: 1px solid #333;
          padding: 6px;
          text-align: left;
        }

        th {
          background: #ddd;
        }
      </style>
    </head>
    <body>
      ${results
        .map(
          (env) => `
        <div class="card">
          <div class="header">${escapeHtml(env.envTitle)}</div>

          ${
            env.systemPrivileges?.length
              ? `
            <div class="section">
              <h3>System Privileges</h3>
              <table>
                <thead>
                  <tr>
                    <th>GRANTEE</th>
                    <th>PRIVILEGE</th>
                  </tr>
                </thead>
                <tbody>
                  ${env.systemPrivileges
                    .map(
                      (r) => `
                    <tr>
                      <td>${escapeHtml(r.grantee)}</td>
                      <td>${escapeHtml(r.privilege)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }

          ${
            env.accountStatus?.length
              ? `
            <div class="section">
              <h3>Account Status</h3>
              <table>
                <thead>
                  <tr>
                    <th>USERNAME</th>
                    <th>ACCOUNT_STATUS</th>
                    <th>EXPIRY_DATE</th>
                    <th>DEFAULT_TABLESPACE</th>
                  </tr>
                </thead>
                <tbody>
                  ${env.accountStatus
                    .map(
                      (r) => `
                    <tr>
                      <td>${escapeHtml(r.username)}</td>
                      <td>${escapeHtml(r.account_status)}</td>
                      <td>${escapeHtml(r.expiry_date ?? "")}</td>
                      <td>${escapeHtml(r.default_tablespace)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }

          ${
            env.roles?.length
              ? `
            <div class="section">
              <h3>Roles</h3>
              <table>
                <thead>
                  <tr>
                    <th>GRANTEE</th>
                    <th>GRANTED_ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  ${env.roles
                    .map(
                      (r) => `
                    <tr>
                      <td>${escapeHtml(r.grantee)}</td>
                      <td>${escapeHtml(r.granted_role)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }

        </div>
      `,
        )
        .join("")}
    </body>
  </html>
  `;
}

/**
 * @summary Generates a PDF report from account query results.
 *
 * Uses a reusable Puppeteer browser instance to render the generated
 * HTML representation of the results and produce a PDF buffer.
 *
 * @param {PdfQueryResults[]} results - Account query results formatted for PDF rendering
 * @returns {Promise<Buffer>} Generated PDF file as a buffer
 *
 * @throws {Error} If browser launch or PDF rendering fails
 */
export async function generatePdf(results: PdfQueryResults[]) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  const html = buildHtml(results);

  await page.setContent(html, { waitUntil: "networkidle0" });

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await page.close();

  return buffer;
}
