export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface SessionUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}
