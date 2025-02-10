export type LoginCredentials = { email: string; password: string };

export type JWTPayload = {
  userId: number;
  email: string;
};

export type CheckAuthBodyData = {
  accessToken: string;
};
