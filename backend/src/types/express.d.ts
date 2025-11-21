import "express-serve-static-core";
import { UserInfo } from "./userInfo";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserInfo | null;
  }
}
