import BookmarksModel, {
  BookmarkCategory,
  BookmarksDocument,
} from "../../database/models/bookmarks/bookmarks";
import PostModel, { PostDocument } from "../../database/models/posts/posts";
import { User } from "../../services/models/auth_models";
import {
  AddToBookmarkResult,
  ArchiveBookmarkCategoryParam,
  ArchivedCategoryResult,
  DeleteBookmarkCategoryParam,
  DeleteCategoryResult,
  GetBookmarksResult,
  SearchBookmarkParams,
  UserBookmarkQueryFailedResult,
  UserBookmarkQueryResult,
  UserBookmarksCreationParams,
  UserBookmarksDeleteParams,
} from "../../services/models/bookmark_models";
import { DeleteBookmarkResult } from "../models/bookmark_models";

//!
//!
export default class BookmarksService {
  //!
  //! ADD TO BOOKMARK
  public async addToBookmarks(
    params: UserBookmarksCreationParams
  ): Promise<AddToBookmarkResult | string> {
    try {
      const { userID, postToBookmark, categoryName } = params;
      const { postID } = postToBookmark;

      const post = await PostModel.findById(postID);

      if (!post) {
        return "Post not found";
      }

      let bookmarks = await BookmarksModel.findOne({ userID });

      if (!bookmarks) {
        bookmarks = new BookmarksModel({
          userID,
          categories: [],
        });
      }

      const categoryIndex = bookmarks.categories.findIndex(
        (category) => category.name === categoryName
      );

      //! CATEGORY FOUND
      if (categoryName && categoryIndex !== -1) {
        const category = bookmarks.categories[categoryIndex];

        if (!category.posts.some((id) => id.toString() === postID)) {
          category.posts.push(post);
        } else {
          return "Post already bookmarked in this category";
        }
      }
      //! CATEGORY NOT FOUND
      else if (
        (categoryName === "" || categoryName === null) &&
        categoryIndex === -1
      ) {
        const newCategory: BookmarkCategory = {
          name: categoryName,
          posts: [post],
        };

        bookmarks.categories.push(newCategory);
      }

      //! POST IS NOT SAVED TO A CATEGORY, SO CATEGORY NAME IS "RANDOM"
      else {
        const randomCategoryIndex = bookmarks.categories.findIndex(
          (category) => category.name === "random"
        );

        //! RANDOM CATEGORY EXISTS
        if (randomCategoryIndex !== -1) {
          const randomCategory = bookmarks.categories[randomCategoryIndex];
          if (!randomCategory.posts.some((id) => id.toString() === postID)) {
            randomCategory.posts.push(post);
          } else {
            return "Post already bookmarked in the random category";
          }
        }
        //! RANDOM CATEGORY DOESN'T EXIST, CREATE IT
        else {
          const newRandomCategory: BookmarkCategory = {
            name: "random",
            posts: [post],
          };

          bookmarks.categories.push(newRandomCategory);
        }
      }

      const savedBookmarks = await bookmarks.save();

      const user = { userID: savedBookmarks.userID } as unknown as User;

      return {
        user,
        bookmarks: savedBookmarks as unknown as BookmarksDocument[],
      };
    } catch (error) {
      console.error("Error adding to bookmarks:", error);
      return "Could not add to bookmark";
    }
  }

  //!
  //! GET USER BOOKMARKS
  public async getBookmarksByUserID(
    userID: string
  ): Promise<GetBookmarksResult | string> {
    try {
      const result = (await BookmarksModel.findOne({
        userID,
      })) as unknown as GetBookmarksResult;

      return result;
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      return "Could not fetch bookmarks";
    }
  }

  //!
  //! QUERY BOOKMARKS
  public async searchBookmarks(
    params: SearchBookmarkParams
  ): Promise<UserBookmarkQueryResult | UserBookmarkQueryFailedResult> {
    try {
      const { userID, searchQuery } = params;

      const userBookmarks = await BookmarksModel.findOne({ userID });

      if (!userBookmarks || !Array.isArray(userBookmarks.categories)) {
        return {
          result: "We can't find any bookmarks with the word you've entered.",
        };
      }

      const searchRegex = new RegExp(searchQuery, "i");

      const matchedPosts: PostDocument[] = [];

      for (const category of userBookmarks.categories) {
        for (const postID of category.posts) {
          const post = await PostModel.findById(postID);
          if (post && post.text && post.text.match(searchRegex)) {
            matchedPosts.push(post);
          }
        }
      }

      return {
        result: matchedPosts.length > 0 ? matchedPosts : [],
      };
    } catch (error) {
      console.error("Error searching bookmarks:", error);
      return {
        result: "An error occurred, please try again.",
      };
    }
  }

  //!
  //! DELETE USER BOOKMARK
  async deletePostFromBookmarks(
    params: UserBookmarksDeleteParams
  ): Promise<DeleteBookmarkResult> {
    try {
      const { userID, postToDelete, categoryName } = params;
      const { postID } = postToDelete;

      const userBookmarks = await BookmarksModel.findOne({ userID });

      if (!userBookmarks || !Array.isArray(userBookmarks.categories)) {
        return {
          result: "Post has already been deleted or user's bookmarks not found",
        };
      }

      const categoryIndex = userBookmarks.categories.findIndex(
        (category) => category.name === categoryName
      );

      if (categoryIndex !== -1) {
        const category = userBookmarks.categories[categoryIndex];

        const postIndex = category.posts.findIndex(
          (id) => id.toString() === postID
        );

        if (postIndex !== -1) {
          category.posts.splice(postIndex, 1);

          userBookmarks.markModified("categories");

          await userBookmarks.save();

          return {
            result: "Post deleted successfully from user's bookmarks",
          };
        }
      }

      return { result: "Cannot find post in your bookmarks" };
    } catch (error) {
      console.error("Error deleting post from bookmarks:", error);
      return { result: "Failed to delete post from user's bookmarks" };
    }
  }

  //!
  //! ARCHIVE A CATEGORY
  public async archiveBookmarkCategory(
    params: ArchiveBookmarkCategoryParam
  ): Promise<ArchivedCategoryResult> {
    try {
      const { userID, categoryName } = params;

      const userBookmarks = await BookmarksModel.findOne({ userID });

      if (!userBookmarks || !Array.isArray(userBookmarks.categories)) {
        return { result: "User's bookmarks not found" };
      }

      const categoryIndex = userBookmarks.categories.findIndex(
        (category) => category.name === categoryName
      );

      //! CATEGORY FOUND
      if (categoryIndex !== -1) {
        const archivedCategory = userBookmarks.categories.splice(
          categoryIndex,
          1
        )[0];

        userBookmarks.archived.push(archivedCategory);

        userBookmarks.markModified("categories");

        userBookmarks.markModified("archived");

        await userBookmarks.save();

        console.log("Archived Category: ", userBookmarks);

        return { result: "Category archived successfully" };
      }

      return { result: "Category not found" };
    } catch (error) {
      console.error("Error archiving category:", error);
      return { result: "Failed to archive category" };
    }
  }

  //!
  //! DELETE BOOKMARK CATEGORY
  public async deleteBookmarkCategory(
    params: DeleteBookmarkCategoryParam
  ): Promise<DeleteCategoryResult> {
    try {
      const { userID, categoryName } = params;

      const userBookmarks = await BookmarksModel.findOne({ userID });

      if (!userBookmarks || !Array.isArray(userBookmarks.categories)) {
        return { result: "User's bookmarks not found" };
      }

      const categoryIndex = userBookmarks.categories.findIndex(
        (category) => category.name === categoryName
      );

      if (categoryIndex !== -1) {
        const deletedCategory = userBookmarks.categories.splice(
          categoryIndex,
          1
        )[0];

        for (const postID of deletedCategory.posts) {
          await PostModel.findByIdAndDelete(postID);
        }

        userBookmarks.markModified("categories");

        await userBookmarks.save();

        return { result: "Category deleted successfully" };
      }

      const archivedCategoryIndex = userBookmarks.archived.findIndex(
        (archivedCategory) => archivedCategory.name === categoryName
      );

      if (archivedCategoryIndex !== -1) {
        const deletedArchivedCategory = userBookmarks.archived.splice(
          archivedCategoryIndex,
          1
        )[0];

        for (const postID of deletedArchivedCategory.posts) {
          await PostModel.findByIdAndDelete(postID);
        }

        userBookmarks.markModified("archived");

        await userBookmarks.save();

        console.log("New Archived Category: ", userBookmarks);

        return { result: "Archived category deleted successfully" };
      }

      return { result: "Category not found" };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { result: "Failed to delete category" };
    }
  }
}
