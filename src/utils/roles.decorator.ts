import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/entities/roles.enum";


export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);