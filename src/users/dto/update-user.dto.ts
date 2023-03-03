import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    userName?: string;

    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    password?: string;
    
}
