//!
//!THIS FILE HOUSES SIMPLE MODELS OF DATA TYPES THAT WE REQUEST FROM OR RETURN TO THE CLIENT
//!
//!

//!
//! THIS IS THE MODEL OF THE REQUESTED DATA FROM THE CLIENT FOR REGISTERING A USER
export interface UserCreationParams {
  email: string;
  name: string;
  username: string;
  password: string;
}

//!
//! SYSTEM USER MODEL
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

//!
//! MODEL OF DATA RETURNED TO THE CLIENT
export interface UserAndCredentials {
  user: User;
  token: string;
  refresh: string;
}

//!
//! LOGIN PARAMS
export interface LoginParams {
  email: string;
  password: string;
}

//!
//! REFRESH PARAMS
export interface RefreshParams {
  email: string;
  refreshToken: string;
}
