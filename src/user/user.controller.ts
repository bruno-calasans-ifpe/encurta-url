import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateData, UserUpdateData } from './user.dto';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { NotFoundError } from 'src/errors/NotFoundError';
import { ConflictError } from 'src/errors/ConflictError';
import { NotModifiedError } from 'src/errors/NotModifiedError';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    try {
      return this.userService.getAll();
    } catch (error) {
      throw new InternalServerError('Erro pegar todos os Usuários');
    }
  }

  @Get(':id')
  async getUser(@Param() params: any) {
    const id = params.id;

    // Verifica se o user existe
    const foundUser = await this.userService.get(+id);
    if (!foundUser) throw new NotFoundError('User não encontrado');

    return { message: 'Usuário encontrado', user: foundUser };
  }

  @Post()
  async createUser(@Body() data: UserCreateData) {
    // Verifica se o email não está em uso
    const emailAlreadyInUse = await this.userService.getByEmail(data.email);
    if (emailAlreadyInUse) throw new ConflictError('Email já em uso');

    const createdUser = await this.userService.create(data);

    return {
      message: 'Usuário criado com sucesso',
      user: createdUser,
    };
  }

  @Put(':id')
  async updateUser(@Param() params: any, @Body() data: UserUpdateData) {
    const id = params.id;

    // Verifica se o user existe
    const foundUser = await this.userService.get(+id);
    if (!foundUser) throw new NotFoundError('User não encontrado');

    const result = await this.userService.update(+id, data);

    // Verifica se algo mudou depois de atualizar o user
    if (result.affected === 0) {
      throw new NotModifiedError('Usuário não atualizado');
    }

    return {
      message: 'Usuário atualizado com sucesso',
      user: { ...foundUser, ...data },
    };
  }

  @Delete(':id')
  async deleteUser(@Param() params: any) {
    const id = params.id;

    // Verifica se o user existe
    const foundUser = await this.userService.get(+id);
    if (!foundUser) throw new NotFoundError('Usuário não encontrado');

    const result = await this.userService.delete(+id);

    // Verifica se algo mudou depois de remover o user
    if (result.affected === 0) {
      throw new NotModifiedError('Usuário não removido');
    }

    return { message: 'Usuário removido com sucesso', user: foundUser };
  }
}
