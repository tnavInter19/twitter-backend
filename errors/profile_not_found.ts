import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom_api_errors";

export class UserProfileNotFoundError extends CustomApiError {
  constructor(message: string = "User profile not found") {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
