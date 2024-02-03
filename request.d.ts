import AuthenticatedUser from "middleware/models/authenticated_user";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
