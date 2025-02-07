import { User } from './user.entity';

export type CreateUserBodyData = {
  name: string;
  email: string;
  password: string;
};

export type UpdateCreateUserBodyData = Partial<CreateUserBodyData>;

export type CreateUserData = CreateUserBodyData;
export type UserUpdateData = Partial<CreateUserData>;
