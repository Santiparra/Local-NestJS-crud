import { User } from "src/users/entities/user.entity";
import { faker } from '@faker-js/faker';


export function createRandomUser(): User {
    return {
      id: faker.datatype.number(),
      name: faker.name.fullName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: ["USER"]
    };
}