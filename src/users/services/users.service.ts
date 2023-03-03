import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';
import { createRandomUser } from "src/utils/seeder";

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);
  
  users: User[] =[
    {id: 0, name: "Georgina", userName: "Geo", email: "laGeo@mail.com", password: "password", roles: ["ADMIN"]},
    {id: 1, name: "Jorge", userName: "ElJorge", email: "Jorgito@mail.com", password: "password", roles: ["ADMIN"]},
    {id: 2, name: "Valentin", userName: "Tin", email: "Valentin@mail.com", password: "password", roles: ["ADMIN"]},  
  ]  

  removeUser( id: number ): User[] {
    this.users = this.users.filter(esto => esto.id !== id);
    return this.users;
  }

  async updateUser( id: number, updateUserDto: UpdateUserDto ): Promise<User[]> {
    let user = this.findUserByID(id);
    const index = this.users.indexOf ( user[0] );
    if ( !user || index == -1 ) throw new NotFoundException("Este user no se encuentra en la base de datos");
    if (updateUserDto.password) {
      const { password } = updateUserDto;
      const hashedPasswd = await bcrypt.hash(password, 10);
      updateUserDto = {...updateUserDto, password: hashedPasswd}
    }
    user[0] = {...user[0], ...updateUserDto};
    this.users.splice(index, 1, user[0]);
    return user
  }

  async replaceUser(id: number, createUserDto: CreateUserDto): Promise<User[]> {
    let user = this.findUserByID(id);    
    const index = this.users.indexOf ( user[0] );
    if ( !user || index == -1 ) this.createUser(createUserDto);
    const { password } = createUserDto;
    const hashedPasswd = await bcrypt.hash(password, 10);
    user[0] = {...user[0], ...createUserDto, password: hashedPasswd};
    this.users.splice(index, 1, user[0]);
    return user
  }

  async createUser( createUserDto: CreateUserDto ): Promise<User> {
    let id = this.generateId();
    const { password } = createUserDto;
    const hashedPasswd = await bcrypt.hash(password, 10);
    let user = {  id: id, ...createUserDto, password: hashedPasswd, roles: ["USER"] };    
    this.users.push(user);
    return user
  }

  async findUserByName( userName: string ): Promise<User>  {
    return this.users.find(user => user.userName === userName);
  }

  findUserByID( id: number ): User[] {
    const user = this.users.filter(aquello => aquello.id === id);
    return user   
  }

  findAllUsers(): User[] {
    return this.users;
  }

  generateId(): number {
    let randomId = Math.floor(Math.random() * 101);
    this.users.forEach((user) => {
      if (user.id === randomId) this.generateId()
    })
    return randomId
  }

  seedMyFakeDb(seeds: number) {
    for (let i = 0; i < seeds; i++) {
      this.users.push(createRandomUser());
      };
    return this.users    
    }
}
