import { UploadedFile } from "express-fileupload";
import { mkdir, stat, unlink } from "node:fs/promises";
import {
  getProfilePhotosRootDir,
  getUserIdProfilePhotoName,
  getUserIdProfilePhotoPath,
} from "../../controllers/utils/utils";
import Profile from "../../database/models/profile/profile_model";
import {
  InvalidMimeTypeError,
  PhotoNotFoundError,
  UserProfileNotFoundError,
} from "../../errors";
import {
  Profile as ProfileModel,
  ProfilePhotoInfo,
} from "../models/profile_model";

export default class ProfileService {
  //!
  //! FETCHING USER PROFILE
  public async get(userId: string): Promise<ProfileModel> {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new UserProfileNotFoundError();
    }
    return profile.toJSON() as ProfileModel;
  }

  //!
  //! STORING / SAVING USER PROFILE
  public async set(
    userId: String,
    profileModel: ProfileModel
  ): Promise<ProfileModel> {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        bio: profileModel.bio,
        location: profileModel.location,
        website: profileModel.website,
      },
      { upsert: true, new: true, runValidators: true }
    );
    return profile.toJSON() as ProfileModel;
  }

  //!
  //! SAVE PROFILE PHOTO
  public async setPhoto(
    userId: string,
    req: { files: { photo: UploadedFile } }
  ): Promise<void> {
    const { photo } = req.files;

    if (photo.mimetype !== "image/jpeg") {
      throw new InvalidMimeTypeError();
    }

    const uploadDir = getProfilePhotosRootDir();
    const uploadPath = getUserIdProfilePhotoPath(userId);

    return new Promise<void>(async (resolve, reject) => {
      try {
        await mkdir(uploadDir, { recursive: true });
        await photo.mv(uploadPath);
        resolve();
      } catch {
        reject();
      }
    });
  }

  //!
  //! GET PROFILE PHOTO
  public async getPhoto(userId: string): Promise<ProfilePhotoInfo> {
    const photoPath = getUserIdProfilePhotoPath(userId);

    try {
      const status = await stat(photoPath);
      const isFile = status.isFile();
      if (!isFile) {
        throw new Error();
      }

      const photoName = getUserIdProfilePhotoName(userId);
      const options = {
        root: getProfilePhotosRootDir(),
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };
      return {
        photoName,
        options,
      };
    } catch {
      throw new PhotoNotFoundError();
    }
  }

  //!
  //! DELETE PHOTO
  public async deletePhoto(userId: string): Promise<void> {
    const photoPath = getUserIdProfilePhotoPath(userId);

    try {
      await unlink(photoPath);
    } catch {
      throw new PhotoNotFoundError();
    }
  }
}
