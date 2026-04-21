import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':correo')
  findByCorreo(@Param('correo') correo: string) {
    return this.usersService.findByCorreo(correo);
  }

  @Post(':documento/vehiculo')
  addVehiculo(@Param('documento') documento: string, @Body() vehiculoDto: any) {
    return this.usersService.addVehiculo(documento, vehiculoDto);
  }

  @Patch(':documento') update(@Param('documento') documento: string,@Body() updateDto: any) {
    return this.usersService.update(documento, updateDto);
  }
}