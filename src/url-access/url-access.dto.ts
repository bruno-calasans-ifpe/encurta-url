import { OmitId } from 'src/types/common.type';
import { UrlAccess } from './url-access.entity';

export type UrlAccessCreateData = OmitId<UrlAccess>;
export type UrlAccessUpdateData = Partial<UrlAccessCreateData>;

