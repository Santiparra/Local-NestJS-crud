import { Controller, Get, Post, UseGuards, Request, Logger } from '@nestjs/common';
import { Role } from 'src/users/entities/roles.enum';
import { Roles } from 'src/utils/roles.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  create(@Request() req): any {
    return {msg: "logged in"};
  }
    
  //esta ruta es simplemente para revisar que el serializador funcione ok
  @UseGuards(LocalAuthGuard)
  @Get()
  myMetadataHeaderInfo(@Request() req) {
    return req.user;
  }

}
