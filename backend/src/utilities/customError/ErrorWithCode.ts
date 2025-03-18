import { HTTP_STATUS_CODES } from "@/constants";

/**
 * Represents an error with an associated error code.
 *
 * @class ErrorWithCode
 * @extends Error
 *
 * @param {string} message - The error message.
 * @param {number} code - The error code. Defaults to an internal server error.
 *
 * @example
 * const err = new ErrorWithCode('test');
 * console.log(err.code); // 500
 *
 * @example
 * const err = new ErrorWithCode('test', 401);
 * console.log(err.code); // 401
 * console.log(err.message); // 'test'
 */
export class ErrorWithCode extends Error {
  public code: number;

  constructor(
    message: string,
    code: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.code = code;
  }
}
