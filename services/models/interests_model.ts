import { InterestDocument } from "../../database/models/interests/interests";
import { User } from "./auth_models";

export interface Interest {
  interestName: string;
}

export interface UserInterestsCreationParams {
  userID: string;
  interests: Interest[];
}

export interface UserAndInterests {
  user: User;
  interests: InterestDocument[];
}
