import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const exists = this.users.find(
      user => user.correo === createUserDto.correo
    );

    if (exists) {
      throw new Error('El usuario ya existe');
    }

    this.users.push(createUserDto);
    return createUserDto;
  }

  findAll() {
    return this.users;
  }

  findByCorreo(correo: string) {
    const user = this.users.find(
      user =>
        user.correo.trim().toLowerCase() ===
        correo.trim().toLowerCase()
    );

    return user || null;
  }
}