interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string | null;
  role: string;
  profile_picture: string | null;
  isEmailVerified: boolean;
  age: number;
  gender: string;
  created_at: Date;
  updated_at: Date;
}

interface TokenUser {
  name: string;
  userId: string;
  email: string;
  role: string;
  bio?: string | null;
  image?: string;
  age: number;
  gender: string;
}

export const createToken = (user: Partial<User>) => {
  return {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
    bio: user.bio,
    image: user.profile_picture,
    isEmailVerifyied: user.isEmailVerified,
    age: user.age,
    gender: user.gender,
  };
};
