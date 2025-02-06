import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlCreateData, UrlUpdateData } from './url.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { NotModifiedError } from 'src/errors/NotModifiedError';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  getAllUrls() {
    try {
      return this.urlService.getAll();
    } catch (error) {
      throw new InternalServerError('Erro pegar todos os URLs');
    }
  }

  @Get(':id')
  async getUrl(@Param() params: any) {
    const id = params.id;

    // Verifica se o url existe
    const foundUrl = await this.urlService.get(+id);
    if (!foundUrl) throw new NotFoundError('Url não encontrado');

    return { message: 'URL encontrado', url: foundUrl };
  }

  @Post()
  async createUrl(@Body() data: UrlCreateData) {
    data.shortUrl = this.urlService.generateShortUrl(data.redirectUrl);
    const createdUrl = await this.urlService.create(data);

    return {
      message: 'URL criada com sucesso',
      url: createdUrl,
    };
  }

  @Put(':id')
  async updateUrl(@Param() params: any, @Body() data: UrlUpdateData) {
    const id = params.id;

    // Verifica se o url existe
    const foundUrl = await this.urlService.get(+id);
    if (!foundUrl) throw new NotFoundError('Url não encontrado');

    // Atualiza url
    if (data.fullUrl || data.redirectUrl) {
      data.shortUrl = this.urlService.generateShortUrl(
        data.redirectUrl || foundUrl.redirectUrl,
      );
    }

    foundUrl.fullUrl = data.fullUrl || foundUrl.fullUrl;
    foundUrl.redirectUrl = data.redirectUrl || foundUrl.redirectUrl;

    const result = await this.urlService.update(+id, data);

    // Verifica se algo mudou depois de atualizar o url
    if (result.affected === 0) {
      throw new NotModifiedError('URL não atualizado');
    }

    console.log(data);

    return {
      message: 'URL atualizado com sucesso',
      url: { ...foundUrl, ...data },
    };
  }

  @Delete(':id')
  async deleteUrl(@Param() params: any) {
    const id = params.id;

    // Verifica se o url existe
    const foundUrl = await this.urlService.get(+id);
    if (!foundUrl) throw new NotFoundError('URL não encontrado');

    const result = await this.urlService.delete(+id);

    // Verifica se algo mudou depois de remover o url
    if (result.affected === 0) {
      throw new NotModifiedError('URL não removido');
    }

    return { message: 'URL removido com sucesso', url: foundUrl };
  }
}
