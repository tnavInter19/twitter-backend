import { Document, Schema, model } from "mongoose";

//!
//!
const BlockedAccountSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  blockedAccounts: [
    {
      type: String,
    },
  ],
});

BlockedAccountSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface BlockedAccountDocument extends Document {
  userID: string;
  blockedAccounts: string[];
}

export const BlockedAccountsModel = model<BlockedAccountDocument>(
  "blocked accounts",
  BlockedAccountSchema
);
