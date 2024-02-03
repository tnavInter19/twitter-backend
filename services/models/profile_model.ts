//!
//! SIMPLE MODEL INTERFACE NEEDED FOR USER PROFILE ENDPOINT
export interface Profile {
  bio?: string;
  location?: string;
  website?: string;
}

//! PROFILE PHOTO INFO
export interface ProfilePhotoInfo {
  photoName: string;
  options: any;
}
