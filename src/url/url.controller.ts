/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlBodyData, UpdateUrlBodyData } from './url.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { NotModifiedError } from 'src/errors/NotModifiedError';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTPayload } from 'src/auth/auth.dto';

type Params = {
  id: string;
  short_url: string;
};
@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getAllUrls() {
    try {
      return this.urlService.getAll();
    } catch (error: unknown) {
      throw new InternalServerError('Erro pegar todos os URLs');
    }
  }

  @Get(':id')
  async getUrl(
    @Param() { id }: Params,
    @Query('byShortUrl') byShortUrl: string,
  ) {
    // Verifica se o url existe pela URL curta
    if (byShortUrl) {
      const foundUrl = await this.urlService.getByShortUrl(id);
      if (!foundUrl) throw new NotFoundError('Url não encontrado');
      return { message: 'URL encontrado', url: foundUrl };
    }

    const foundUrl = await this.urlService.get(+id);
    if (!foundUrl) throw new NotFoundError('Url não encontrado');
    return { message: 'URL encontrado', url: foundUrl };
  }

  @Get('/user/:id')
  async getUserUrl(@Param() { id }: Params) {
    const foundUser = await this.userService.get(+id);
    if (!foundUser) throw new NotFoundError('Usuário não encontrado');

    const foundUrls = await this.urlService.getUserUrls(+id);
    return { message: 'URL encontrado', urls: foundUrls };
  }

  @Post()
  async createUrl(@Body() data: CreateUrlBodyData) {
    // Verifica se o user existe
    const foundUser = await this.userService.get(+data.user_id);
    if (!foundUser) throw new NotFoundError('Usuário não encontrado');

    // Dados para serem utilizados para criar uma url
    const dataToCreateUrl = {
      ...data,
      shortUrl: this.urlService.generateShortUrl(data.redirectUrl),
      user: foundUser,
      accesses: [],
    };

    const createdUrl = await this.urlService.create(dataToCreateUrl);

    return {
      message: 'URL criada com sucesso',
      url: createdUrl,
    };
  }

  @Put(':id')
  async updateUrl(@Param() params: Params, @Body() data: UpdateUrlBodyData) {
    const id = params.id;
    const dataToUpdate: { [key in string]: any } = {};

    // Verifica se o url existe
    const foundUrl = await this.urlService.get(+id);
    if (!foundUrl) throw new NotFoundError('Url não encontrado');

    // Verifica se o usuário existe
    if (data.user_id) {
      const foundUser = await this.userService.get(data.user_id);
      if (!foundUser) throw new NotFoundError('Usuário não encontrado');
      dataToUpdate.user = foundUser;
    }

    // Atualiza apenas a URL completa
    if (data.fullUrl) {
      dataToUpdate.fullUrl = data.fullUrl;
    }

    // Atualiza a URL curta
    if (data.redirectUrl) {
      dataToUpdate.redirectUrl = data.redirectUrl;
      dataToUpdate.shortUrl = this.urlService.generateShortUrl(
        data.redirectUrl || foundUrl.redirectUrl,
      );
    }

    // if (data.fullUrl || data.redirectUrl) {
    //   dataToUpdate.fullUrl = data.fullUrl;
    //   dataToUpdate.shortUrl = this.urlService.generateShortUrl(
    //     data.redirectUrl || foundUrl.redirectUrl,
    //   );
    // }

    // Atualiza url
    const result = await this.urlService.update(+id, dataToUpdate);

    // Verifica se algo mudou depois de atualizar o url
    if (result.affected === 0) {
      throw new NotModifiedError('URL não atualizada');
    }

    console.log(dataToUpdate);

    const { user, ...url } = foundUrl;

    return {
      message: 'URL atualizado com sucesso',
      url,
    };
  }

  @Delete(':id')
  async deleteUrl(@Param() params: Params) {
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
