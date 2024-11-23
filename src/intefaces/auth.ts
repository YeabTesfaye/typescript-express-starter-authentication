export interface UserData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
  verificationToken?: string;
  isEmailVerified?: boolean;
  gender?: string;
  age: string;
  role?: string;
}
