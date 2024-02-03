import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom_api_errors";

export class InvalidMimeTypeError extends CustomApiError {
  constructor(message: string = "Invalid MimeType") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
