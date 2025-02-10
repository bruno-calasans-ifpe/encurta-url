/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UrlAccessService } from './url-access.service';
import { CreateAccessUrlBodyData } from './url-access.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { NotModifiedError } from 'src/errors/NotModifiedError';
import { UrlService } from 'src/url/url.service';
import { Request } from 'express';
const geoIp = require('geoip-lite');

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
  async createUrlAccess(
    @Req() req: Request,
    @Body() { url_id }: CreateAccessUrlBodyData,
  ) {
    // Tentar encontrar url
    const foundUrl = await this.urlService.get(url_id);
    if (!foundUrl) throw new NotFoundError('Url não encontrada');

    // Cria Acesso para url
    const lookup = geoIp.lookup(req.ip || 'localhost');

    const createdUrlAccess = await this.urlAccessService.create({
      url: foundUrl,
      accessDate: new Date().toLocaleDateString('pt-Br'),
      ip: req.ip || 'localhost',
      location: lookup?.city || 'Desconhecido',
    });

    return {
      message: 'Acesso de Url criado com sucesso',
      urlaccess: createdUrlAccess,
    };
  }

  // @Put(':id')
  // async updateUrlAccess(
  //   @Body() data: UpdateAccessUrlBodyData,
  //   @Param() params: Params,
  // ) {
  //   const id = params.id;

  //   // Verifica se o urlaccess existe
  //   const foundUrlAccess = await this.urlAccessService.get(+id);
  //   if (!foundUrlAccess) throw new NotFoundError('UrlAccess não encontrado');

  //   const result = await this.urlAccessService.update(+id, {});

  //   // Verifica se algo mudou depois de atualizar o urlaccess
  //   if (result.affected === 0) {
  //     throw new NotModifiedError('Acesso de Url não atualizado');
  //   }

  //   return {
  //     message: 'Acesso de Url atualizado com sucesso',
  //     urlaccess: { ...foundUrlAccess, ...data },
  //   };
  // }

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
