// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<UserDto> {
    const user = await this.userService.findById(payload.sub.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(dto: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = dto;
    const user = await this.userService.findOneByUsernameAndPassword(
      username,
      password,
    );

    const payload = { sub: user };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
