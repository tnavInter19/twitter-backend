//!
//!THIS IS SIMPLY THE REPOSITORY THAT DOES THE MAIN FUNCTIONS.
//! ALL FUNCTIONS IN HERE ARE CALLED BY THE CONTROLLERS
//!

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Blacklist from "../../database/models/blacklist/blacklist_tokens";
import User from "../../database/models/user/user_model";
import { BadRequestError, UnauthorizedError } from "../../errors";
import AuthenticatedUser from "../../middleware/models/authenticated_user";
import {
  LoginParams,
  RefreshParams,
  UserAndCredentials,
  UserCreationParams,
} from "../models/auth_models";

export default class AuthService {
  //!
  //! REGISTER USER
  public async register(
    params: UserCreationParams
  ): Promise<UserAndCredentials> {
    const user = await User.create(params);
    const uuid = uuidv4();
    const token = user.createJWT(uuid);
    const refresh = user.createRefresh(uuid);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
      refresh,
    };
  }

  //!
  //! LOGIN
  public async login(params: LoginParams): Promise<UserAndCredentials> {
    const user = await User.findOne({ email: params.email });
    if (!user) {
      throw new UnauthorizedError();
    }
    const isCorrectPassword = await user.comparePassword(params.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedError();
    }
    const uuid = uuidv4();
    const token = user.createJWT(uuid);
    const refresh = user.createRefresh(uuid);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
      refresh,
    };
  }

  //!
  //! LOG OUT
  public async logout(jti: string): Promise<void> {
    await Blacklist.create({ object: jti, kind: "jti" });
  }

  //!
  //! REFRESH TOKEN

  public async refresh(
    params: RefreshParams,
    user: AuthenticatedUser
  ): Promise<UserAndCredentials> {
    const decodedRefreshToken = jwt.verify(
      params.refreshToken,
      process.env.REFRESH_SECRET
    ) as {
      userId: string;
      email: string;
      iss: string;
      jti: string;
    };

    if (
      decodedRefreshToken.email === user.email &&
      decodedRefreshToken.iss === process.env.JWT_ISSUER &&
      decodedRefreshToken.userId == user.id &&
      decodedRefreshToken.email === user.email &&
      decodedRefreshToken.iss === user.iss &&
      decodedRefreshToken.jti === user.jti
    ) {
      //! MAKE SURE THE TOKEN ISN'T BLACKLISTED
      const blacklisted = await Blacklist.findOne({
        object: decodedRefreshToken.jti,
        kind: "jti",
      });
      if (blacklisted) {
        throw new UnauthorizedError();
      }

      //! BLACK LIST THE GIVEN REFRESH TOKEN
      await Blacklist.create({ object: decodedRefreshToken.jti });

      const user = await User.findById(decodedRefreshToken.userId);

      if (!user) {
        throw new BadRequestError();
      }

      const uuid = uuidv4();
      const newToken = user.createJWT(uuid);
      const newRefresh = user.createRefresh(uuid);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        token: newToken,
        refresh: newRefresh,
      };
    } else {
      throw new UnauthorizedError();
    }
  }

  //! END OF FILE
}
