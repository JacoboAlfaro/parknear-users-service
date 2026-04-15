import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
  JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '1h' },
  }),
  PassportModule,
],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}