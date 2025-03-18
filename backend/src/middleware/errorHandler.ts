import { ErrorWithCode } from '@/utilities/customError/ErrorWithCode';
import { HTTP_STATUS_CODES } from '@/constants';
import { NextFunction, Request, Response } from 'express';

/**
 * Handles errors and sends appropriate response.
 * Use this as the last middleware in express.ts
 *
 * @param err - The error message or Error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const errorHandler = (
  err: string | Error | ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Is this one of the valid input options?
  if (!(typeof err === 'string' || err instanceof Error)) {
    const message = `Unknown server error.`;
    console.error(message);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(message);
  }
  // Determine what message and status should be
  const message = err instanceof Error ? err.message : err;
  const code = err instanceof ErrorWithCode ? err.code : 500;
  // Report through console
  if (code === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
    console.error(message);
    console.error((err as Error).stack);
  } else {
    console.warn(message);
  }
  // Return status and message
  res.status(code).send(`Error: ${message}`);
  next();
};

export default errorHandler;
