/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JWTPayload, LoginCredentials } from './auth.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Verifica se a senha está certa
  async validateUser({ email, password }: LoginCredentials) {
    // Tenta achar usuário no banco de dados
    const foundUser = await this.userService.getByEmail(email);
    if (!foundUser) return null;

    // Valida senha fornecida
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) return null;

    return foundUser;
  }

  // Cria access token e refresh token (não ainda)
  async createToken(payload: JWTPayload) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Encripta senha
  async hashPassword(password: string) {
    const hashedPassword = (await bcrypt.hash(password, 10)) as string;
    return hashedPassword;
  }

  // Cria access token e refresh token (não ainda)
  async checkToken(token: string) {
    return this.jwtService.verify<JWTPayload>(token);
  }
}
