import { Document, Schema, model } from "mongoose";
import { Post } from "../../../services/models/post_model";

export enum InterestEnums {
  Technology = "Technology 🖥️",
  Science = "Science 🥼",
  Art = "Art 🎨",
  History = "History 🏺",
  Animation = "Animation 💫",
  Astrology = "Astrology 👩🏽‍🚀",
  Books = "Books 📚",
  Writing = "Writing ✍🏽",
}

const InterestSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [],
  users: [],
});

//! DEFINE THE "toJSON" METHOD WITHIN THE SCHEMA OPTIONS
InterestSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface InterestDocument extends Document {
  name: string;
  posts: Post[];
  users: string[];
}

export default model<InterestDocument>("Interests", InterestSchema);
