import { OmitId } from 'src/types/common.type';
import { UrlAccess } from './url-access.entity';

export type CreateAccessUrlBodyData = {
  url_id: number;
};

export type UpdateAccessUrlBodyData = Partial<CreateAccessUrlBodyData>;

export type CreateAccessUrlData = OmitId<UrlAccess>;

export type UpdateAccessUrlData = Partial<CreateAccessUrlData>;
