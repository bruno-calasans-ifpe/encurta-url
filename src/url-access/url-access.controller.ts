import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { UrlAccessService } from './url-access.service';
import { UrlAccessCreateData, UrlAccessUpdateData } from './url-access.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { NotModifiedError } from 'src/errors/NotModifiedError';

@Controller('url-access')
export class UrlAccessController {
  constructor(private readonly urlAccessService: UrlAccessService) {}

  @Get()
  getAllUrlAccesss() {
    try {
      return this.urlAccessService.getAll();
    } catch (error) {
      throw new InternalServerError('Erro pegar todos os Acessos de Url');
    }
  }

  @Get(':id')
  async getUrlAccess(@Param() params: any) {
    const id = params.id;

    // Verifica se o urlaccess existe
    const foundUrlAccess = await this.urlAccessService.get(+id);
    if (!foundUrlAccess) throw new NotFoundError('UrlAccess não encontrado');

    return { message: 'Acesso de Url encontrado', urlaccess: foundUrlAccess };
  }

  @Post()
  async createUrlAccess(@Body() data: UrlAccessCreateData) {
    const createdUrlAccess = await this.urlAccessService.create(data);

    return {
      message: 'Acesso de Url criado com sucesso',
      urlaccess: createdUrlAccess,
    };
  }

  @Patch('/click/:id')
  async clickUrl(@Param() params: any) {
    const id = params.id;

    // Verifica se o urlaccess existe
    const foundUrlAccess = await this.urlAccessService.get(+id);
    if (!foundUrlAccess)
      throw new NotFoundError('Acesso de Url não encontrada');

    // Aumenta o número de clicks em
    foundUrlAccess.clicks++;

    // Atualiza acesso da url
    await this.urlAccessService.update(+id, foundUrlAccess);

    return {
      message: 'Acesso de Url clicada com sucesso',
      urlaccess: foundUrlAccess,
    };
  }

  @Put(':id')
  async updateUrlAccess(
    @Body() data: UrlAccessUpdateData,
    @Param() params: any,
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
  async deleteUrlAccess(@Param() params: any) {
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
