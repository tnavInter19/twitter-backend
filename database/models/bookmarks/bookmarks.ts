import { Document, Schema, model } from "mongoose";
import { PostDocument } from "../../../database/models/posts/posts";

export interface BookmarkCategory {
  name: string;
  posts: PostDocument[];
}

const BookmarksSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  categories: [
    {
      name: {
        type: String,
        required: false,
        unique: true,
      },
      posts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
  ],
  archived: [],
});

//! DEFINE THE "toJSON" METHOD WITHIN THE SCHEMA OPTIONS
BookmarksSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface BookmarksDocument extends Document {
  userID: string;
  categories: BookmarkCategory[];
  archived: BookmarkCategory[];
}

export default model<BookmarksDocument>("Bookmarks", BookmarksSchema);
