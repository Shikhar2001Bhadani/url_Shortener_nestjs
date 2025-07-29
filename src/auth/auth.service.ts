import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...rest } = user.toObject();
      return rest;
    }
    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({ sub: user._id, email: user.email }),
    };
  }

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.usersService.create(email, hash);
  }
}
