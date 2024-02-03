//!
//! THIS FILE IS BASICALLY THE ENDPOINTS THAT THE CLIENT CALLS
//! WE USE TSOA TO HELP US GENERATE THE END API DOCS
//!
//!
import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  Body,
  Controller,
  Delete,
  OperationId,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import AuthenticatedUser from "../../middleware/models/authenticated_user";
import AuthService from "../../services/auth/auth_service";
import {
  LoginParams,
  RefreshParams,
  UserAndCredentials,
  UserCreationParams,
} from "../../services/models/auth_models";

//! ENFORCING THE ROUTE USING TSOA @ROUTE
@Route("/api/v1/auth")
//! ENFORCING A ROUTE TAG
@Tags("Auth")

//!
//! CONTROLLER STARTS HERE
export class AuthController extends Controller {
  //! STATING THAT THE METHOD BELOW IS A POST METHOD. IT CAN BE A GET, PUT OR DELETE
  @Post("register")
  //! ID FOR THE OPERATION
  @OperationId("registerUser")

  //!
  //! REGISTER USER
  public async register(
    //! STATING THAT THE PARAM SHOULD BE PASSED THROUGH THE BODY OF THE REQUEST
    @Body() requestBody: UserCreationParams
  ): //! PROMISES ARE BASICALLY FUTURES
  Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.CREATED);
    return new AuthService().register(requestBody);
  }

  //!
  //! LOGIN USER
  @Post("login")
  @OperationId("loginUser")
  public async login(
    @Body() requestBody: LoginParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.OK);
    return new AuthService().login(requestBody);
  }

  //! LOGOUT END POINT
  @Delete("logout")
  @Security("jwt")
  @OperationId("logoutUser")
  public async logout(@Request() request: ExpressRequest): Promise<void> {
    this.setStatus(StatusCodes.NO_CONTENT);
    const user = request.user as { jti: string };
    await new AuthService().logout(user.jti);
  }

  //!
  //! REFRESH ENDPOINT
  @Post("refresh")
  @Security("jwt_without_verification")
  @OperationId("refreshUser")
  public async refresh(
    @Request() request: ExpressRequest,
    @Body() requestBody: RefreshParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.OK);
    const user = request.user as AuthenticatedUser;
    return new AuthService().refresh(requestBody, user);
  }
}
