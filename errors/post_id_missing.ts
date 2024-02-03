import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom_api_errors";

export class OriginalPostIdMissingError extends CustomApiError {
  constructor(message: string = "Original post id is missing") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
