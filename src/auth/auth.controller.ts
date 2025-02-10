import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserBodyData } from 'src/user/user.dto';
import { ForbiddenError } from 'src/errors/ForbiddenError';
import { JWTPayload, LoginCredentials } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { ConflictError } from 'src/errors/ConflictError';
import { JwtAuthGuard } from './jwt-auth.guard';
import { NotFoundError } from 'src/errors/NotFoundError';
import { UnauthorizedError } from 'src/errors/UnauthorizedError';

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
    const { accessToken } = await this.authService.createToken({
      userId: validUser.id,
      email: validUser.email,
    });

    return { accessToken, user: validUser };
  }

  @Post('register')
  async register(@Body() data: CreateUserBodyData) {
    // Verifica se o email não está em uso
    const foundEmail = await this.userService.getByEmail(data.email);
    if (foundEmail) throw new ConflictError('Email já está em uso');

    // Troca a senha enviada por uma senha hashed
    data.password = await this.authService.hashPassword(data.password);

    // Cria usuário
    const user = await this.userService.create(data);

    // Retorna usuário criado
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAuth(@Req() req: { user: JWTPayload; ip: string }) {
    const { userId, email } = req.user;

    const foundUser = await this.userService.get(userId);
    if (!foundUser) throw new UnauthorizedError('Usuário não encontrado');

    if (foundUser.email !== email)
      throw new UnauthorizedError('Token inválido');

    return { user: foundUser };
  }
}
