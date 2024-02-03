import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface Error {
  message: string;
  name: string;
  statusCode?: number;
  code?: number;
}

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let customError = {
    message: err.message,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // user exists
  if (err.name === "MongoServerError" && err.code === 11000) {
    customError.message = "User already exists!";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res
    .status(customError.statusCode)
    .json({ code: customError.statusCode, message: customError.message });
};
