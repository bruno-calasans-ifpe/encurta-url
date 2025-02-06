import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/public')
  publicRoute(): string {
    return 'Rota pública';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  protectedRoute(): string {
    return 'Rota protegida';
  }
}
