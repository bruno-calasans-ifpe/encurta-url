import { OmitId } from 'src/types/common.type';
import { Url } from './url.entity';

export type UrlCreateData = {
  fullUrl: string;
  redirectUrl: string;
  user_id: number;
};
export type UrlUpdateData = Partial<UrlCreateData>;
