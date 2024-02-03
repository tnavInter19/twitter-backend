import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom_api_errors";

export class NoPhotoUploadedError extends CustomApiError {
  constructor(message: string = "No photo uploaded") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
