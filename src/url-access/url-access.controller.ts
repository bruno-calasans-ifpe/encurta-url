import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UrlAccessService } from './url-access.service';
import {
  CreateAccessUrlBodyData,
  UpdateAccessUrlBodyData,
} from './url-access.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { NotModifiedError } from 'src/errors/NotModifiedError';
import { UrlService } from 'src/url/url.service';

type Params = {
  id: string;
};

@Controller('url-access')
export class UrlAccessController {
  constructor(
    private readonly urlAccessService: UrlAccessService,
    private readonly urlService: UrlService,
  ) {}

  @Get()
  getAllUrlAccesss() {
    try {
      return this.urlAccessService.getAll();
    } catch (error) {
      throw new InternalServerError('Erro pegar todos os Acessos de Url');
    }
  }

  @Get(':id')
  async getUrlAccess(@Param() params: Params) {
    const id = params.id;

    // Verifica se o urlaccess existe
    const foundUrlAccess = await this.urlAccessService.get(+id);
    if (!foundUrlAccess)
      throw new NotFoundError('Acesso de Url não encontrado');

    return { message: 'Acesso de Url encontrado', urlaccess: foundUrlAccess };
  }

  @Post()
  async createUrlAccess(@Body() data: CreateAccessUrlBodyData) {
    // Tentar encontrar url
    const foundUrl = await this.urlService.get(data.url_id);
    if (!foundUrl) throw new NotFoundError('Url não encontrada');

    // Cria Acesso para url
    const createdUrlAccess = await this.urlAccessService.create({
      ...data,
      url: foundUrl,
    });

    return {
      message: 'Acesso de Url criado com sucesso',
      urlaccess: createdUrlAccess,
    };
  }

  @Put(':id')
  async updateUrlAccess(
    @Body() data: UpdateAccessUrlBodyData,
    @Param() params: Params,
  ) {
    const id = params.id;

    // Verifica se o urlaccess existe
    const foundUrlAccess = await this.urlAccessService.get(+id);
    if (!foundUrlAccess) throw new NotFoundError('UrlAccess não encontrado');

    const result = await this.urlAccessService.update(+id, data);

    // Verifica se algo mudou depois de atualizar o urlaccess
    if (result.affected === 0) {
      throw new NotModifiedError('Acesso de Url não atualizado');
    }

    return {
      message: 'Acesso de Url atualizado com sucesso',
      urlaccess: { ...foundUrlAccess, ...data },
    };
  }

  @Delete(':id')
  async deleteUrlAccess(@Param() params: Params) {
    const id = params.id;

    // Verifica se o urlaccess existe
    const foundUrlAccess = await this.urlAccessService.get(+id);
    if (!foundUrlAccess)
      throw new NotFoundError('Acesso de Url não encontrado');

    const result = await this.urlAccessService.delete(+id);

    // Verifica se algo mudou depois de remover o urlaccess
    if (result.affected === 0) {
      throw new NotModifiedError('Acesso de Url não removido');
    }

    return {
      message: 'Acesso de Url removido com sucesso',
      urlaccess: foundUrlAccess,
    };
  }
}
