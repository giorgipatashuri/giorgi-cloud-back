import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
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
      { id: userId },
      {
        expiresIn: '1h',
      },
    );
    const refreshToken = this.jwt.sign(
      { id: userId },
      {
        expiresIn: '7h',
      },
    );
    return { accessToken, refreshToken };
  }
  private async validateUser(dto: AuthDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
