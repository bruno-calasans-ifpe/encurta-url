import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateData } from 'src/user/user.dto';
import { ForbiddenError } from 'src/errors/ForbiddenError';
import { LoginCredentials } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { InternalServerError } from 'src/errors/InternalServerErrorError';
import { ConflictError } from 'src/errors/ConflictError';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() credentials: LoginCredentials) {
    // Valida se as credenciais do usuário são válidas
    const validUser = await this.authService.validateUser(credentials);
    if (!validUser) throw new ForbiddenError('Crendenciais inválidas');

    // Cria token
    const token = await this.authService.createToken({
      userId: validUser.id.toString(),
      email: validUser.email,
    });

    return token;
  }

  @Post('register')
  async register(@Body() data: UserCreateData) {
    // Verifica se o email não está em uso
    const foundEmail = await this.userService.getByEmail(data.email);
    if (foundEmail) throw new ConflictError('Email já está em uso');

    // Troca a senha enviada por uma senha hashed
    data.password = await this.authService.hashPassword(data.password);

    // Cria usuário
    const user = await this.userService.create(data);

    // Retorna usuário criado
    return user;
  }
}
