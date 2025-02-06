import { OmitId } from 'src/types/common.type';
import { Url } from './url.entity';

export type UrlCreateData = OmitId<Url>;
export type UrlUpdateData = Partial<UrlCreateData>;
