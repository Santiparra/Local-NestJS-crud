import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor (private userService: UsersService) {}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async validateUser ( userName: string, password: string ) {
    this.logger.log("validando usuario");
    const userExist = await this.userService.findUserByName(userName);

    if (userExist && userExist.password === password) {
      const { password, userName, email, ...rest } = userExist
      this.logger.log("usuario validado");
      return rest
    } 
    this.logger.log("no se pudo validar el usuario");
    return null

  }

}
