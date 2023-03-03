import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authService: AuthService) {
        super();
    }

    async validate( userName: string, password: string ) {
        const userExist = await this.authService.validateUser(userName, password);
    
        if (!userExist) throw new UnauthorizedException();
        
        return userExist;
      }
    
} 