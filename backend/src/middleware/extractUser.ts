import { Request, Response, NextFunction } from "express";
import { Buffer } from "buffer";

// extraxt user info and attach them to req.user
export const extractUserInfo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers["x-userinfo"];

  if (!header) {
    req.user = null;
    return next();
  }

  try {
    //Decode base64 encoded userinfo
    const decoded = Buffer.from(header as string, "base64").toString("utf8");

    const data = JSON.parse(decoded);

    req.user = {
      username: data.idir_username || "-",
      email: data.email || "-",
      name: data.name || "-",
      roles: data.realm_access?.roles || [],
    };
  } catch (err) {
    console.error("Failed to parse X-USERINFO:", err);
    req.user = null;
  }

  next();
};
