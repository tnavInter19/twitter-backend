import { Document, Schema, model } from "mongoose";

//!
//!
const MutedWordsSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  mutedWords: [
    {
      type: String,
    },
  ],
});

MutedWordsSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface MutedWordsDocument extends Document {
  userID: string;
  mutedWords: string[];
}

export const MutedWordsModel = model<MutedWordsDocument>(
  "muted words",
  MutedWordsSchema
);
