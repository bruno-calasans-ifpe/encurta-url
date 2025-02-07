import { OmitId } from 'src/types/common.type';
import { Url } from './url.entity';

export type CreateUrlBodyData = {
  fullUrl: string;
  redirectUrl: string;
  user_id: number;
};

export type UpdateUrlBodyData = Partial<CreateUrlBodyData>;

export type CreateUrlData = OmitId<Url>;

export type UpdateUrlData = Partial<CreateUrlData>;
