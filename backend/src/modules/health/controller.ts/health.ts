import type { Request, Response } from "express";

/**
 * Check the health of the ExpressJS Server
 * @param req - Request information
 * @param res - Response information
 * @returns res - 200 status indicating healthy API
 */
export const serverHealth = async (req: Request, res: Response) => {
  // testing github action
  return res.status(200).send("API Healthy");
};
