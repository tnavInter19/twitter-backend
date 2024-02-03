import { unlink } from "node:fs/promises";
import {
  getAttachmentPath,
  getUserIdProfilePhotoPath,
} from "../../controllers/utils/utils";
import Attachment from "../../database/models/attachment/attachment";
import Follow from "../../database/models/follow/follow";
import Post from "../../database/models/posts/posts";
import Profile from "../../database/models/profile/profile_model";
import Reaction from "../../database/models/reactions/reaction";
import User from "../../database/models/user/user_model";
import { BadRequestError } from "../../errors";
import {
  DeleteUserResponse,
  SetUsernameParams,
  SetUsernameResponse,
} from "../models/user_model";

export default class UserService {
  //!
  //!
  public async setUsername(
    userId: String,
    params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: params.username },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!user) {
      throw new BadRequestError();
    }

    return {
      user: user.toJSON(),
    };
  }

  //!
  //!

  public async deleteUser(userId: string): Promise<DeleteUserResponse> {
    // delete all reactions for a user
    const { deletedCount: reactionsDeleted } = await Reaction.deleteMany({
      userId,
    });

    // delete profile photo (if any)
    const profilePhotoPath = getUserIdProfilePhotoPath(userId);
    try {
      await unlink(profilePhotoPath);
    } catch (err) {
      // no profile photo found
    }

    // delete all attachments for all posts the user has made
    const attachments = await Attachment.find({ userId });
    for (const attachment of attachments) {
      const attachmentPath = getAttachmentPath(attachment._id);
      try {
        await unlink(attachmentPath);
      } catch (err) {
        // silently fail
      }
    }
    const { deletedCount: attachmentsDeleted } = await Attachment.deleteMany({
      userId,
    });

    // delete all posts, reposts and replies the user has made
    const { deletedCount: postsDeleted } = await Post.deleteMany({ userId });

    // delete profile
    const { deletedCount: profilesDeleted } = await Profile.deleteOne({
      userId,
    });

    // delete all follows where the user is the follower
    const { deletedCount: followsDeleted } = await Follow.deleteMany({
      followerUserId: userId,
    });

    // delete user
    const { deletedCount: usersDeleted } = await User.deleteOne({
      _id: userId,
    });

    return {
      reactionsDeleted,
      attachmentsDeleted,
      postsDeleted,
      profilesDeleted,
      followsDeleted,
      usersDeleted,
    };
  }
}
