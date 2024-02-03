import { BookmarksDocument } from "../../database/models/bookmarks/bookmarks";
import { PostDocument } from "../../database/models/posts/posts";
import { User } from "../../services/models/auth_models";
import { PostForGetBookmarkResult } from "../../services/models/post_model";

export interface UserBookmarkToFetch {
  userID: string;
}

export interface UserPostToBookmark {
  postID: string;
}
export interface UserBookmarksCreationParams {
  userID: string;
  categoryName: string;
  postToBookmark: UserPostToBookmark;
}

export interface UserBookmarksDeleteParams {
  userID: string;
  categoryName: string;
  postToDelete: UserPostToBookmark;
}

export interface AddToBookmarkResult {
  user: User;
  bookmarks: BookmarksDocument[];
}

export interface GetBookmarksResult {
  bookmarks: PostForGetBookmarkResult[];
}

export interface DeleteBookmarkResult {
  result: string;
}

export interface SearchBookmarkParams {
  userID: string;
  searchQuery: string;
}

export interface UserBookmarkQueryResult {
  result: PostDocument[];
}

export interface UserBookmarkQueryFailedResult {
  result: string;
}

export interface ArchiveBookmarkCategoryParam {
  userID: string;
  categoryName: string;
}

export interface ArchivedCategoryResult {
  result: string;
}

export interface DeleteBookmarkCategoryParam {
  userID: string;
  categoryName: string;
}

export interface DeleteCategoryResult {
  result: string;
}
