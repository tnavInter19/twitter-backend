import { StatusCodes } from "http-status-codes";
import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Path,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import BookmarksService from "../../services/bookmarks/bookmark_service";
import {
  AddToBookmarkResult,
  ArchiveBookmarkCategoryParam,
  ArchivedCategoryResult,
  DeleteBookmarkCategoryParam,
  DeleteBookmarkResult,
  GetBookmarksResult,
  SearchBookmarkParams,
  UserBookmarkQueryFailedResult,
  UserBookmarkQueryResult,
  UserBookmarksCreationParams,
  UserBookmarksDeleteParams,
} from "../../services/models/bookmark_models";

@Route("/api/v1/bookmarks")
@Tags("Bookmarks")
export class BookmarksController extends Controller {
  //!
  //!
  @Get("/getBookmarks/{userID}")
  @OperationId("getBookmarks")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getBookmarks(
    @Path() userID: string
  ): Promise<GetBookmarksResult | string> {
    return await new BookmarksService().getBookmarksByUserID(userID);
  }

  //!
  //!
  @Post("/setBookmarks")
  @OperationId("setBookmark")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async setBookmark(
    @Body() body: UserBookmarksCreationParams
  ): Promise<AddToBookmarkResult | string> {
    return await new BookmarksService().addToBookmarks(body);
  }

  //!
  //!
  @Get("/searchBookmarks/{userID}/{searchQuery}")
  @OperationId("searchBookmarks")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async searchBookmarks(
    @Path() userID: string,
    @Path() searchQuery: string
  ): Promise<UserBookmarkQueryResult | UserBookmarkQueryFailedResult> {
    const body = { userID, searchQuery } as SearchBookmarkParams;
    return await new BookmarksService().searchBookmarks(body);
  }

  //!
  //!
  @Delete("/deleteBookmarks")
  @OperationId("deleteBookmarks")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async deleteBookmark(
    @Body() body: UserBookmarksDeleteParams
  ): Promise<DeleteBookmarkResult> {
    return await new BookmarksService().deletePostFromBookmarks(body);
  }

  //!
  //!
  @Post("/archiveBookmarkCategory")
  @OperationId("archiveBookmarkCategory")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async archiveBookmarkCategory(
    @Body() body: ArchiveBookmarkCategoryParam
  ): Promise<ArchivedCategoryResult> {
    return await new BookmarksService().archiveBookmarkCategory(body);
  }

  //!
  //!
  @Delete("/deleteBookmarkCategory")
  @OperationId("deleteBookmarkCategory")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async deleteBookmarkCategory(
    @Body() body: DeleteBookmarkCategoryParam
  ): Promise<DeleteBookmarkResult> {
    return await new BookmarksService().deleteBookmarkCategory(body);
  }
}
