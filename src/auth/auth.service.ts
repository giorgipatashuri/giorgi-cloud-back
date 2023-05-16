import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async login() {
    return 'test';
  }
  async register(dto: CreateUserDto) {
    const oldUser = await this.usersService.findByEmail(dto.email);

    if (oldUser) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(dto);

    const tokens = await this.issueTokens(newUser.id);

    return {
      user: newUser,
      ...tokens,
    };
  }
  private async issueTokens(userId: number) {
    const accessToken = this.jwt.sign(
      { userId },
      {
        expiresIn: '1h',
      },
    );
    const refreshToken = this.jwt.sign(
      { userId },
      {
        expiresIn: '7h',
      },
    );
    return { accessToken, refreshToken };
  }
}
