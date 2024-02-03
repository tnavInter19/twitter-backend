import mongoose from "mongoose";
import InterestsModel, {
  InterestDocument,
  InterestEnums,
} from "./models/interests/interests";

export const populateInterestsCollection = async (): Promise<void> => {
  try {
    //! CHECK IF COLLECTION EXISTS
    const collectionExists = await mongoose.connection.db
      .listCollections({ name: "interests" })
      .next();

    if (!collectionExists) {
      //! COLLECTION DOESN'T EXIST, CREATE AND POPULATE IT
      const Interests: InterestDocument[] = [];

      //! CREATE DOCUMENTS FROM EACH ENUM
      Object.values(InterestEnums).forEach((interestName) => {
        const topic = new InterestsModel({ name: interestName, posts: [] });
        Interests.push(topic);
      });

      //! INSERT THE DOCUMENT INTO THE COLLECTION
      await InterestsModel.insertMany(Interests);
      console.log("Interests collection created and populated!");
    } else {
      //! COLLECTION EXISTS, CHECK IF IT'S EMPTY
      const count = await InterestsModel.countDocuments();

      if (count === 0) {
        //! COLLECTION EXISTS BUT IS EMPTY, POPULATE IT
        const Interests: InterestDocument[] = [];

        Object.values(InterestEnums).forEach((interestName) => {
          const topic = new InterestsModel({ name: interestName, posts: [] });
          Interests.push(topic);
        });

        await InterestsModel.insertMany(Interests);
        console.log("Interests collection populated!");
      } else {
        console.log("Interests collection is already populated.");
      }
    }
  } catch (error) {
    console.error("Error populating Interests collection:", error);
  }
};
