import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Put, 
  UsePipes, 
  ValidationPipe, 
  ParseIntPipe, 
  HttpStatus, 
  NotFoundException, 
  Res, 
  UseGuards,
  Logger
} from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { Roles } from "src/utils/roles.decorator";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { Role } from "../entities/roles.enum";
import { User } from "../entities/user.entity";
import { UsersService } from "../services/users.service";


@Controller("users")
export class UsersController {

  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Get()
  findAllUsers( @Res() res ): User[] {
    const users = this.usersService.findAllUsers();
    if (!users) throw new NotFoundException("La base de datos para users no se encuentra"); 
    return res.status(HttpStatus.OK).json({ msg: "Users:", users });
  }

  @UseGuards(LocalAuthGuard)
  @Get(":id")
  findUserByID( @Param("id", ParseIntPipe) id: number,  @Res() res ): User[] {
    const user = this.usersService.findUserByID(id);
    if (!user || user.length == 0) throw new NotFoundException("User no encontrado");      
    return res.status(HttpStatus.OK).json({ msg: "User:", user });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser( @Body() createUserDto: CreateUserDto,  @Res() res ): Promise<User> {
    const createdUser = await this.usersService.createUser(createUserDto);
    return res.status(HttpStatus.OK).json({ msg: "User creado con éxito:", createdUser });
  }
  
  @UseGuards(LocalAuthGuard)
  @Patch(":id")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,  
    @Res() res ): Promise<User[]> {
    const editedUser = await this.usersService.updateUser(id, updateUserDto);   
    return res.status(HttpStatus.OK).json({ msg: "User editado con éxito:", editedUser });    
  }

  @UseGuards(LocalAuthGuard)
  @Put(":id")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async replaceUser( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() createUserDto: CreateUserDto,  
    @Res() res ): Promise<User[]> {
    const replacedUser = await this.usersService.replaceUser(id, createUserDto);
    return res.status(HttpStatus.OK).json({ msg: "User actualizado o editado con éxito:", replacedUser }); 
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  removeUser( @Param("id", ParseIntPipe) id: number, @Res() res ): User[] {
    const deletedUser= this.usersService.removeUser(id);
    if (!deletedUser || deletedUser.length == 0) throw new NotFoundException("Este user no existe");      
    return res.status(HttpStatus.OK).json({ msg: "El Usuario ya no se encuentra en la base de datos", deletedUser });
  }

  @Roles(Role.ADMIN)
  @Post(":seeds")
  seedMyFakeDb( @Param("seeds", ParseIntPipe) seeds: number ) {
    return this.usersService.seedMyFakeDb(seeds);
  }

}
