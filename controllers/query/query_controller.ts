import * as express from "express";
import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  Controller,
  Get,
  OperationId,
  Path,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import AuthenticatedUser from "../../middleware/models/authenticated_user";
import { PostType } from "../../services/models/post_model";
import {
  PostStatsResponse,
  PostsResponse,
  ReactionsResponse,
} from "../../services/models/query_models";
import QueriesService from "../../services/query/query_service";

@Route("/api/v1/query")
@Tags("Queries")
export class QueriesController extends Controller {
  //!
  //!
  /**
   * Retrieves posts with given parameters, with pagination.
   */
  @Get("/posts")
  @OperationId("queryPosts")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async queryPosts(
    @Request() request: express.Request,
    @Query() userId?: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number,
    @Query() type?: PostType
  ): Promise<PostsResponse> {
    const user = request.user as AuthenticatedUser;
    const resolvedUserId = userId ?? user.id;
    return new QueriesService().queryPosts(
      {
        userId: resolvedUserId,
        resultsPerPage,
        page,
        type,
      },
      resolvedUserId
    );
  }

  //!
  //!
  /**
   * Retrieves replies to a post with given parameters, with pagination.
   */
  @Get("/replies/{postId}")
  @OperationId("getReplies")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReplies(
    @Path() postId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<PostsResponse> {
    return new QueriesService().getReplies({
      postId,
      resultsPerPage,
      page,
    });
  }

  //!
  //!
  /**
   * Retrieves reactions made by a user, with pagination.
   */
  @Get("/reactions/{userId}")
  @OperationId("getReactions")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReactions(
    @Request() request: ExpressRequest,
    @Path() userId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<ReactionsResponse> {
    const user = request.user as AuthenticatedUser;
    const requestUserId = user.id;
    return new QueriesService().getReactions(
      {
        userId,
        resultsPerPage,
        page,
      },
      requestUserId
    );
  }

  //!
  //!
  /**
   * Retrieves stats for a post: number of reactions, replies and reposts.
   */
  @Get("/stats/{postId}")
  @OperationId("getPostStats")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getPostStats(
    @Path() postId: string
  ): Promise<PostStatsResponse> {
    return new QueriesService().getPostStats(postId);
  }
}
