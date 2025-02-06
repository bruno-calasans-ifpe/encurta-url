import { OmitId } from 'src/types/common.type';
import { User } from './user.entity';

export type UserCreateData = OmitId<User>;
export type UserUpdateData = Partial<UserCreateData>;
