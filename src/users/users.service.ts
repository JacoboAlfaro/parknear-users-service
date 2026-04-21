import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRecord, UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    this.validateRequiredFields(createUserDto);
    const hashedPassword = await hash(createUserDto.contrasena, 10);

    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        contrasena: hashedPassword,
      });

      return this.sanitizeUser(user);
      // PostgreSQL unique_violation.
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserRecord) {
    return {
      id: user.id,
      documento_identidad: user.documento_identidad,
      primer_nombre: user.primer_nombre,
      segundo_nombre: user.segundo_nombre,
      primer_apellido: user.primer_apellido,
      segundo_apellido: user.segundo_apellido,
      email: user.email,
      celular: user.celular,
      estado: user.estado,
      tipo_usuario: user.tipo_usuario,
      fecha_creacion: user.fecha_creacion,
      fecha_actualizacion: user.fecha_actualizacion,
    };
  }

  findByCorreo(correo: string) {
    const user = this.users.find(
      user =>
        user.correo?.trim().toLowerCase() ===
        correo.trim().toLowerCase()
    );
  private validateRequiredFields(createUserDto: CreateUserDto) {
    const requiredFields: Array<keyof CreateUserDto> = [
      'documento_identidad',
      'primer_nombre',
      'primer_apellido',
      'email',
      'contrasena',
      'celular',
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = createUserDto[field];
      return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Faltan campos requeridos: ${missingFields.join(', ')}`,
      );
    }
  }

  addVehiculo(documento: string, vehiculoDto: any) {
    const user = this.users.find(
      u => u.documento_identidad === documento
    );

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.vehiculos) {
      user.vehiculos = [];
    }

    user.vehiculos.push(vehiculoDto);

    return user;
  }

  update(documento: string, updateDto: any) {
  const user = this.users.find(
    u => u.documento_identidad === documento
  );

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  Object.assign(user, updateDto);

  return user;
}
}