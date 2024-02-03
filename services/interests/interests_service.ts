import Interests, {
  InterestDocument,
} from "../../database/models/interests/interests";
import User from "../../database/models/user/user_model";
import {
  UserAndInterests,
  UserInterestsCreationParams,
} from "../../services/models/interests_model";

//!
//!
export default class InterestsService {
  //!
  //!
  public async getInterests(): Promise<InterestDocument[]> {
    try {
      const interests = await Interests.find();

      return interests;
    } catch (error) {
      console.error("Error fetching Interests:", error);
      throw error;
    }
  }

  public async setUserInterests(
    userId: string,
    params: UserInterestsCreationParams
  ) {
    const updatedInterests: InterestDocument[] = [];

    //! LOOP THROUGH ALL INTERESTS SELECTED BY THE USER
    for (const interest of params.interests) {
      //! FIND THE INTEREST IN THE DB
      const existingInterest = await Interests.findOne({
        name: interest.interestName,
      });

      if (existingInterest) {
        //! ADD THE USERS ID TO THE INTEREST'S USER ARRAY
        if (!existingInterest.users.includes(userId)) {
          existingInterest.users.push(userId);
          const updatedInterest = await existingInterest.save();
          updatedInterests.push(updatedInterest);
        } else {
          updatedInterests.push(existingInterest);
        }
      } else {
        //! IF THE INTEREST DOESN'T EXIST, CREATE A NEW ONE
        const newInterest = new Interests({
          name: interest.interestName,
          posts: [],
          users: [userId],
        });
        const createdInterest = await newInterest.save();
        updatedInterests.push(createdInterest);
      }
    }

    //!  RETURN UPDATED INTERESTS AND USER
    const user = await User.findById(userId);
    return { user, interests: updatedInterests } as UserAndInterests;
  }
}
