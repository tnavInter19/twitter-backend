//!
//! UTILS FOR USER PROFILE PHOTOS START HERE

//!
//! FOR PHOTO ROOT DIR
export const getProfilePhotosRootDir = function (): string {
  return __dirname + "/../uploads/images/profile/";
};

//!
//! FOR PHOTO NAME
export const getUserIdProfilePhotoName = function (userId: string): string {
  return userId + ".jpg";
};

//!
//! FOR PATH
export const getUserIdProfilePhotoPath = function (userId: string): string {
  return getProfilePhotosRootDir() + getUserIdProfilePhotoName(userId);
};

//!
//!
//! ATTACHMENTS
export const getAttachmentPath = function (attachmentId: string): string {
  return getAttachmentsRootDir() + getAttachmentPhotoName(attachmentId);
};

export const getAttachmentsRootDir = function (): string {
  return __dirname + "/../uploads/images/attachment/";
};

export const getAttachmentPhotoName = function (attachmentId: string): string {
  return attachmentId + ".jpg";
};
