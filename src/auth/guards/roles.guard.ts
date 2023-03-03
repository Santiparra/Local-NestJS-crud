import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/users/entities/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor (private reflector: Reflector) {}

    //Esto es para intentar extraer la metadata del decorador personalizado(segun contexto)
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true        
        const { user } = context.switchToHttp().getRequest();        
        return requiredRoles.some(role => user.roles.includes(role));    
    }
}